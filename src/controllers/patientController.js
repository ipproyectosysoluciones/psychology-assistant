/**
 * Patient Controller
 * Gestiona endpoints de pacientes
 */

import { Patient } from '../models/index.js';
import { ApiResponse, appError } from '../utils/apiResponse.js';

/**
 * POST /api/v1/patients
 * Crear paciente
 */
export const createPatient = async (req, res, next) => {
  try {
    const {
      clinic, user, dateOfBirth, gender, idType, idNumber,
      address, phone, insurance, emergencyContact
    } = req.body;

    const existingPatient = await Patient.findOne({ clinic, idNumber });
    if (existingPatient) {
      return next(new appError('El paciente ya existe en esta clínica', 400));
    }

    const patient = await Patient.create({
      clinic,
      user,
      dateOfBirth,
      gender,
      idType,
      idNumber,
      address,
      phone,
      insurance,
      emergencyContact
    });

    return res.status(201).json(new ApiResponse(
      201,
      patient,
      'Paciente creado exitosamente'
    ));
  } catch (error) {
    return next(new appError(error.message, 400));
  }
};

/**
 * GET /api/v1/patients/:id
 * Obtener detalles del paciente
 */
export const getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('clinic', 'name')
      .populate('preferredTherapist', 'user');

    if (!patient) {
      return next(new appError('Paciente no encontrado', 404));
    }

    return res.status(200).json(new ApiResponse(
      200,
      patient,
      'Paciente obtenido'
    ));
  } catch (error) {
    return next(new appError(error.message, 400));
  }
};

/**
 * GET /api/v1/clinics/:clinicId/patients
 * Listar pacientes por clínica
 */
export const getPatientsByClinic = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    const skip = (page - 1) * limit;

    const patients = await Patient.find({ clinic: req.params.clinicId, status })
      .populate('user', 'firstName lastName email')
      .skip(skip)
      .limit(limit);

    const total = await Patient.countDocuments({ clinic: req.params.clinicId, status });

    return res.status(200).json(new ApiResponse(
      200,
      { patients, total, page, pages: Math.ceil(total / limit) },
      'Pacientes obtenidos'
    ));
  } catch (error) {
    return next(new appError(error.message, 400));
  }
};

/**
 * PUT /api/v1/patients/:id
 * Actualizar paciente
 */
export const updatePatient = async (req, res, next) => {
  try {
    const {
      dateOfBirth, phone, insurance, insurancePlan,
      emergencyContact, status, preferredTherapist, notes
    } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { dateOfBirth, phone, insurance, insurancePlan, emergencyContact, status, preferredTherapist, notes },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return next(new appError('Paciente no encontrado', 404));
    }

    return res.status(200).json(new ApiResponse(
      200,
      patient,
      'Paciente actualizado'
    ));
  } catch (error) {
    return next(new appError(error.message, 400));
  }
};

/**
 * DELETE /api/v1/patients/:id
 * Eliminar paciente
 */
export const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return next(new appError('Paciente no encontrado', 404));
    }

    return res.status(200).json(new ApiResponse(
      200,
      null,
      'Paciente eliminado'
    ));
  } catch (error) {
    return next(new appError(error.message, 400));
  }
};

/**
 * GET /api/v1/patients/:id/medical-history
 * Obtener historial médico del paciente
 */
export const getPatientMedicalHistory = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return next(new appError('Paciente no encontrado', 404));
    }

    return res.status(200).json(new ApiResponse(
      200,
      {
        medicalHistory: patient.medicalHistory,
        allergies: patient.allergies,
        medications: patient.medications
      },
      'Historial médico obtenido'
    ));
  } catch (error) {
    return next(new appError(error.message, 400));
  }
};
