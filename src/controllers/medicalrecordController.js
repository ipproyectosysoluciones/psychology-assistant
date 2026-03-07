/**
 * Medical Record Controller
 * Gestiona endpoints de historiales clínicos
 */

import { MedicalRecord } from '../models/index.js';
import { ApiResponse, appError } from '../utils/apiResponse.js';

/**
 * POST /api/v1/medical-records
 * Crear historial clínico
 */
export const createMedicalRecord = async (req, res, next) => {
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

    return res
      .status(201)
      .json(new ApiResponse(201, record, 'Historial clínico creado'));
  } catch (error) {
    return next(new appError(error.message, 400));
  }
};

/**
 * GET /api/v1/medical-records/:id
 * Obtener historial clínico
 */
export const getMedicalRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'firstName lastName')
      .populate('therapist', 'user')
      .populate('clinic', 'name');

    if (!record) {
      return next(new appError('Historial no encontrado', 404));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, record, 'Historial obtenido'));
  } catch (error) {
    return next(new appError(error.message, 400));
  }
};

/**
 * GET /api/v1/patients/:patientId/medical-records
 * Listar historiales de un paciente
 */
export const getPatientMedicalRecords = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const records = await MedicalRecord.find({ patient: req.params.patientId })
      .skip(skip)
      .limit(limit)
      .sort({ recordDate: -1 });

    const total = await MedicalRecord.countDocuments({
      patient: req.params.patientId,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { records, total, page, pages: Math.ceil(total / limit) },
          'Historiales obtenidos',
        ),
      );
  } catch (error) {
    return next(new appError(error.message, 400));
  }
};

/**
 * PUT /api/v1/medical-records/:id
 * Actualizar historial clínico
 */
export const updateMedicalRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      return next(new appError('Historial no encontrado', 404));
    }

    if (!record.canEdit()) {
      return next(
        new appError('No se puede editar un historial completado', 400),
      );
    }

    const updateData = { ...req.body };
    Object.assign(record, updateData);

    await record.save();

    return res
      .status(200)
      .json(new ApiResponse(200, record, 'Historial actualizado'));
  } catch (error) {
    return next(new appError(error.message, 400));
  }
};

/**
 * DELETE /api/v1/medical-records/:id
 * Eliminar historial clínico
 */
export const deleteMedicalRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findByIdAndDelete(req.params.id);

    if (!record) {
      return next(new appError('Historial no encontrado', 404));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Historial eliminado'));
  } catch (error) {
    return next(new appError(error.message, 400));
  }
};

/**
 * GET /api/v1/clinics/:clinicId/medical-records
 * Listar historiales por clínica
 */
export const getClinicMedicalRecords = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, therapistId } = req.query;
    const skip = (page - 1) * limit;

    const query = { clinic: req.params.clinicId };
    if (therapistId) query.therapist = therapistId;

    const records = await MedicalRecord.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ recordDate: -1 });

    const total = await MedicalRecord.countDocuments(query);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { records, total, page, pages: Math.ceil(total / limit) },
          'Historiales obtenidos',
        ),
      );
  } catch (error) {
    return next(new appError(error.message, 400));
  }
};
