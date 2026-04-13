/**
 * Medical Record Controller
 * Gestiona endpoints de historiales clínicos
 */

import { Request, Response, NextFunction } from 'express';
import { MedicalRecord } from '../models/index.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

/**
 * POST /api/v1/medical-records
 * Crear historial clínico
 */
export const createMedicalRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      patient,
      clinic,
      therapist,
      appointment,
      primaryDiagnosis,
      secondaryDiagnosis,
      symptoms,
      treatmentPlan,
      interventions,
      clinicalNotes,
      progressRating,
      nextSteps,
    } = req.body;

    const record = await MedicalRecord.create({
      patient,
      clinic,
      therapist,
      appointment,
      primaryDiagnosis,
      secondaryDiagnosis,
      symptoms,
      treatmentPlan,
      interventions,
      clinicalNotes,
      progressRating,
      nextSteps,
      status: 'completed',
    });

    res.status(201).json(new ApiResponse(201, record, 'Historial clínico creado'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * GET /api/v1/medical-records/:id
 * Obtener historial clínico
 */
export const getMedicalRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'firstName lastName')
      .populate('therapist', 'user')
      .populate('clinic', 'name');

    if (!record) {
      return next(new AppError('Historial no encontrado', 404));
    }

    res.status(200).json(new ApiResponse(200, record, 'Historial obtenido'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * GET /api/v1/patients/:patientId/medical-records
 * Listar historiales de un paciente
 */
export const getPatientMedicalRecords = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const records = await MedicalRecord.find({
      patient: req.params.patientId,
    })
      .skip(skip)
      .limit(limitNum)
      .sort({ recordDate: -1 });

    const total = await MedicalRecord.countDocuments({
      patient: req.params.patientId,
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { records, total, page: pageNum, pages: Math.ceil(total / limitNum) },
          'Historiales obtenidos'
        )
      );
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * PUT /api/v1/medical-records/:id
 * Actualizar historial clínico
 */
export const updateMedicalRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return next(new AppError('Historial no encontrado', 404));
    }

    if (!(record as unknown as Record<string, unknown> & typeof record).canEdit()) {
      return next(new AppError('No se puede editar un historial completado', 400));
    }

    const updateData = { ...req.body };
    Object.assign(record, updateData);

    await record.save();

    res.status(200).json(new ApiResponse(200, record, 'Historial actualizado'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * DELETE /api/v1/medical-records/:id
 * Eliminar historial clínico
 */
export const deleteMedicalRecord = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);

    if (!record) {
      return next(new AppError('Historial no encontrado', 404));
    }

    res.status(200).json(new ApiResponse(200, null, 'Historial eliminado'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * GET /api/v1/clinics/:clinicId/medical-records
 * Listar historiales por clínica
 */
export const getClinicMedicalRecords = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, therapistId } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const query: Record<string, unknown> = { clinic: req.params.clinicId };
    if (therapistId) query.therapist = therapistId;

    const records = await MedicalRecord.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ recordDate: -1 });

    const total = await MedicalRecord.countDocuments(query);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { records, total, page: pageNum, pages: Math.ceil(total / limitNum) },
          'Historiales obtenidos'
        )
      );
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};
