/**
 * Patient Controller
 * Gestiona endpoints de pacientes
 */

import { Request, Response, NextFunction } from 'express';
import { Patient } from '../models/index.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

/**
 * POST /api/v1/patients
 * Crear paciente
 */
export const createPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      clinic,
      user,
      dateOfBirth,
      gender,
      idType,
      idNumber,
      address,
      phone,
      insurance,
      emergencyContact,
    } = req.body;

    const existingPatient = await Patient.findOne({ clinic, idNumber });
    if (existingPatient) {
      return next(new AppError('El paciente ya existe en esta clínica', 400));
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
      emergencyContact,
    });

    res.status(201).json(new ApiResponse(201, patient, 'Paciente creado exitosamente'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * GET /api/v1/patients/:id
 * Obtener detalles del paciente
 */
export const getPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('clinic', 'name')
      .populate('preferredTherapist', 'user');

    if (!patient) {
      return next(new AppError('Paciente no encontrado', 404));
    }

    res.status(200).json(new ApiResponse(200, patient, 'Paciente obtenido'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * GET /api/v1/clinics/:clinicId/patients
 * Listar pacientes por clínica
 */
export const getPatientsByClinic = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const patients = await Patient.find({ clinic: req.params.clinicId, status })
      .populate('user', 'firstName lastName email')
      .skip(skip)
      .limit(Number(limit));

    const total = await Patient.countDocuments({
      clinic: req.params.clinicId,
      status,
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { patients, total, page, pages: Math.ceil(total / Number(limit)) },
          'Pacientes obtenidos'
        )
      );
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * PUT /api/v1/patients/:id
 * Actualizar paciente
 */
export const updatePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      dateOfBirth,
      phone,
      insurance,
      insurancePlan,
      emergencyContact,
      status,
      preferredTherapist,
      notes,
    } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        dateOfBirth,
        phone,
        insurance,
        insurancePlan,
        emergencyContact,
        status,
        preferredTherapist,
        notes,
      },
      { returnDocument: 'after', runValidators: true }
    );

    if (!patient) {
      return next(new AppError('Paciente no encontrado', 404));
    }

    res.status(200).json(new ApiResponse(200, patient, 'Paciente actualizado'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * DELETE /api/v1/patients/:id
 * Eliminar paciente
 */
export const deletePatient = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return next(new AppError('Paciente no encontrado', 404));
    }

    res.status(200).json(new ApiResponse(200, null, 'Paciente eliminado'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * GET /api/v1/patients/:id/medical-history
 * Obtener historial médico del paciente
 */
export const getPatientMedicalHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return next(new AppError('Paciente no encontrado', 404));
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          medicalHistory: (patient as unknown as Record<string, unknown>).medicalHistory,
          allergies: (patient as unknown as Record<string, unknown>).allergies,
          medications: (patient as unknown as Record<string, unknown>).medications,
        },
        'Historial médico obtenido'
      )
    );
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};
