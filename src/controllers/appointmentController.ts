import { Request, Response } from 'express';
import logger from '../config/logger.js';
import { AUDIT_EVENTS, auditLog } from '../middlewares/auditMiddleware.js';
import { Appointment } from '../models/appointment.js';
import qrService from '../services/qrService.js';
import validationService from '../services/validationService.js';
import { ApiResponse, sendResponse } from '../utils/apiResponse.js';
import { AppError, asyncHandler } from '../utils/appError.js';

/**
 * @module createAppointment
 * @description Crea una nueva cita con validación completa.
 */
export const createAppointment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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

    // Advanced date validation (business rules)
    const dateValidation = validationService.validateAppointmentDate(appointmentDate);
    if (!dateValidation.valid) {
      auditLog(
        req.user!._id,
        AUDIT_EVENTS.DATA_MODIFICATION,
        'Appointment',
        { date },
        'FAILURE',
        dateValidation.error
      );
      throw new Error(dateValidation.error);
    }

    // Check for appointment conflicts (within 30 minutes)
    const conflictValidation = await validationService.validateAppointmentConflict(
      req.user!._id,
      appointmentDate,
      Appointment
    );
    if (!conflictValidation.valid) {
      auditLog(
        req.user!._id,
        AUDIT_EVENTS.DATA_MODIFICATION,
        'Appointment',
        { date },
        'FAILURE',
        conflictValidation.error
      );
      throw new Error(conflictValidation.error);
    }

    // Create appointment
    const appointment = await Appointment.create({
      user: req.user!._id,
      date: appointmentDate,
      description: description.trim(),
      status: 'scheduled',
    });

    // Generate QR code with appointment details
    const qrData = {
      id: appointment._id,
      date: appointment.date,
      description: appointment.description,
      user: req.user!.name,
      status: appointment.status,
    };

    const qrCode = await qrService.generateQR(JSON.stringify(qrData));
    // Audit log successful creation
    auditLog(
      req.user!._id,
      AUDIT_EVENTS.DATA_MODIFICATION,
      'Appointment',
      {
        appointmentId: appointment._id,
        date: appointment.date,
      },
      'SUCCESS'
    );

    logger.info(
      {
        appointmentId: appointment._id,
        userId: req.user!._id,
        date: appointment.date,
      },
      'Appointment created successfully'
    );

    const response = ApiResponse.created(
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
      'Appointment created successfully'
    );

    sendResponse(res, response);
  }
);

/**
 * @module getUserAppointments
 * @description Obtiene todas las citas del usuario autenticado.
 */
export const getUserAppointments = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    const query: Record<string, unknown> = { user: req.user!._id };
    if (status) {
      query.status = status;
    }

    // Pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const appointments = await Appointment.find(query)
      .populate('user', 'name email')
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit as string));

    const total = await Appointment.countDocuments(query);

    logger.info(
      {
        userId: req.user!._id,
        count: appointments.length,
        total,
      },
      'User appointments retrieved'
    );

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
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      },
      'Appointments retrieved successfully'
    );

    sendResponse(res, response);
  }
);

/**
 * @module getAppointmentById
 * @description Obtiene una cita específica por ID.
 */
export const getAppointmentById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Use appointment attached by authorizeAppointmentOwner middleware
    const appointment =
      (req as unknown as Record<string, unknown>).appointment ||
      (await Appointment.findById(req.params.id).populate('user', 'name email'));

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    const apt = appointment as Record<string, unknown>;

    // Check if the user owns this appointment
    const appointmentUserId = (apt.user as Record<string, unknown>)?._id || apt.user;
    const currentUserId = req.user!._id;

    if (appointmentUserId?.toString() !== currentUserId?.toString()) {
      throw new Error('You are not authorized to access this appointment');
    }

    logger.info(
      {
        appointmentId: apt._id,
        userId: req.user!._id,
      },
      'Appointment retrieved'
    );

    const aptUser = apt.user as Record<string, unknown>;
    const response = ApiResponse.success(
      {
        appointment: {
          id: apt._id,
          date: apt.date,
          description: apt.description,
          status: apt.status,
          user: {
            id: aptUser._id,
            name: aptUser.name,
            email: aptUser.email,
          },
          createdAt: apt.createdAt,
          updatedAt: apt.updatedAt,
        },
      },
      'Appointment retrieved successfully'
    );

    sendResponse(res, response);
  }
);

/**
 * @module updateAppointment
 * @description Actualiza una cita existente.
 */
export const updateAppointment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Use appointment attached by authorizeAppointmentOwner middleware
    const appointment = (req as unknown as Record<string, unknown>).appointment as Record<
      string,
      unknown
    >;
    const { date, description, status } = req.body;

    // Check if the user owns this appointment
    const appointmentUserId =
      (appointment.user as Record<string, unknown>)?._id || appointment.user;
    const currentUserId = req.user!._id;

    if (appointmentUserId?.toString() !== currentUserId?.toString()) {
      throw new Error('You are not authorized to update this appointment');
    }

    // Validate date if provided
    if (date) {
      const appointmentDate = new Date(date);
      if (isNaN(appointmentDate.getTime())) {
        throw new AppError('Invalid date format', 400);
      }
      if (appointmentDate <= new Date() && status !== 'completed' && status !== 'cancelled') {
        throw new AppError('Appointment date must be in the future', 400);
      }
      appointment.date = appointmentDate;
    }

    // Update other fields
    if (description) {
      appointment.description = description.trim();
    }

    if (status) {
      const validStatuses = ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
      }
      appointment.status = status;
    }

    await (appointment as Record<string, unknown> & { save: () => Promise<void> }).save();

    logger.info(
      {
        appointmentId: appointment._id,
        userId: req.user!._id,
        updates: { date, description, status },
      },
      'Appointment updated'
    );

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
      'Appointment updated successfully'
    );

    sendResponse(res, response);
  }
);

/**
 * @module deleteAppointment
 * @description Elimina una cita.
 */
export const deleteAppointment = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Use appointment attached by authorizeAppointmentOwner middleware
    const appointment = (req as unknown as Record<string, unknown>).appointment as Record<
      string,
      unknown
    >;

    // Check if the user owns this appointment
    const appointmentUserId =
      (appointment.user as Record<string, unknown>)?._id || appointment.user;
    const currentUserId = req.user!._id;

    if (appointmentUserId?.toString() !== currentUserId?.toString()) {
      throw new Error('You are not authorized to delete this appointment');
    }

    // Only allow deleting future or cancelled appointments
    if ((appointment.date as Date) <= new Date() && appointment.status !== 'cancelled') {
      throw new Error('Cannot delete past or active appointments');
    }

    await Appointment.findByIdAndDelete(appointment._id);

    logger.info(
      {
        appointmentId: appointment._id,
        userId: req.user!._id,
      },
      'Appointment deleted'
    );

    const response = ApiResponse.success(null, 'Appointment deleted successfully');
    sendResponse(res, response);
  }
);
