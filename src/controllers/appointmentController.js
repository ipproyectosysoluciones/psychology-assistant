import logger from '../config/logger.js';
import Appointment from '../models/appointment.js';
import qrService from '../services/qrService.js';
import { ApiResponse, sendResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/appError.js';

/**
 * @module createAppointment
 * @description Crea una nueva cita con validación completa.
 * ES: Crea cita con validaciones, QR code y logging.
 * EN: Creates appointment with validations, QR code and logging.
 */
export const createAppointment = asyncHandler(async (req, res) => {
  const { date, description } = req.body;

  // Validate required fields
  if (!date || !description) {
    throw new Error('Date and description are required');
  }

  // Validate date format and future date
  const appointmentDate = new Date(date);
  if (isNaN(appointmentDate.getTime())) {
    throw new Error('Invalid date format');
  }

  if (appointmentDate <= new Date()) {
    throw new Error('Appointment date must be in the future');
  }

  // Create appointment
  const appointment = await Appointment.create({
    user: req.user._id,
    date: appointmentDate,
    description: description.trim(),
    status: 'scheduled',
  });

  // Generate QR code with appointment details
  const qrData = {
    id: appointment._id,
    date: appointment.date,
    description: appointment.description,
    user: req.user.name,
    status: appointment.status,
  };

  const qrCode = await qrService.generateQR(JSON.stringify(qrData));

  logger.info('Appointment created successfully', {
    appointmentId: appointment._id,
    userId: req.user._id,
    date: appointment.date,
  });

  const response = ApiResponse.success(
    {
      appointment: {
        id: appointment._id,
        date: appointment.date,
        description: appointment.description,
        status: appointment.status,
        createdAt: appointment.createdAt,
      },
      qrCode,
    },
    'Appointment created successfully',
  );

  sendResponse(res, response);
});

/**
 * @module getUserAppointments
 * @description Obtiene todas las citas del usuario autenticado.
 * ES: Recupera citas con populate de usuario y ordenamiento.
 * EN: Retrieves appointments with user populate and sorting.
 */
export const getUserAppointments = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  // Build query
  const query = { user: req.user._id };
  if (status) {
    query.status = status;
  }

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const appointments = await Appointment.find(query)
    .populate('user', 'name email')
    .sort({ date: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Appointment.countDocuments(query);

  logger.info('User appointments retrieved', {
    userId: req.user._id,
    count: appointments.length,
    total,
  });

  const response = ApiResponse.success(
    {
      appointments: appointments.map((apt) => ({
        id: apt._id,
        date: apt.date,
        description: apt.description,
        status: apt.status,
        createdAt: apt.createdAt,
        updatedAt: apt.updatedAt,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
    'Appointments retrieved successfully',
  );

  sendResponse(res, response);
});

/**
 * @module getAppointmentById
 * @description Obtiene una cita específica por ID.
 * ES: Verifica propiedad de la cita antes de devolverla.
 * EN: Checks appointment ownership before returning.
 */
export const getAppointmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id).populate(
    'user',
    'name email',
  );

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  // Check if appointment belongs to user (unless admin)
  if (
    appointment.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new Error('Access denied');
  }

  logger.info('Appointment retrieved', {
    appointmentId: appointment._id,
    userId: req.user._id,
  });

  const response = ApiResponse.success(
    {
      appointment: {
        id: appointment._id,
        date: appointment.date,
        description: appointment.description,
        status: appointment.status,
        user: {
          id: appointment.user._id,
          name: appointment.user.name,
          email: appointment.user.email,
        },
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      },
    },
    'Appointment retrieved successfully',
  );

  sendResponse(res, response);
});

/**
 * @module updateAppointment
 * @description Actualiza una cita existente.
 * ES: Permite actualizar fecha, descripción y estado con validaciones.
 * EN: Allows updating date, description and status with validations.
 */
export const updateAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date, description, status } = req.body;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  // Check ownership
  if (
    appointment.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new Error('Access denied');
  }

  // Validate date if provided
  if (date) {
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      throw new Error('Invalid date format');
    }
    if (
      appointmentDate <= new Date() &&
      status !== 'completed' &&
      status !== 'cancelled'
    ) {
      throw new Error('Appointment date must be in the future');
    }
    appointment.date = appointmentDate;
  }

  // Update other fields
  if (description) {
    appointment.description = description.trim();
  }

  if (status) {
    const validStatuses = [
      'scheduled',
      'confirmed',
      'in-progress',
      'completed',
      'cancelled',
    ];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    appointment.status = status;
  }

  await appointment.save();

  logger.info('Appointment updated', {
    appointmentId: appointment._id,
    userId: req.user._id,
    updates: { date, description, status },
  });

  const response = ApiResponse.success(
    {
      appointment: {
        id: appointment._id,
        date: appointment.date,
        description: appointment.description,
        status: appointment.status,
        updatedAt: appointment.updatedAt,
      },
    },
    'Appointment updated successfully',
  );

  sendResponse(res, response);
});

/**
 * @module deleteAppointment
 * @description Elimina una cita.
 * ES: Solo permite eliminar citas futuras o canceladas.
 * EN: Only allows deleting future or cancelled appointments.
 */
export const deleteAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  // Check ownership
  if (
    appointment.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new Error('Access denied');
  }

  // Only allow deleting future or cancelled appointments
  if (appointment.date <= new Date() && appointment.status !== 'cancelled') {
    throw new Error('Cannot delete past or active appointments');
  }

  await Appointment.findByIdAndDelete(id);

  logger.info('Appointment deleted', {
    appointmentId: id,
    userId: req.user._id,
  });

  const response = ApiResponse.success(
    null,
    'Appointment deleted successfully',
  );
  sendResponse(res, response);
});
