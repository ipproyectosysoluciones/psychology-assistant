/**
 * Clinical Report Controller
 * Gestiona endpoints de reportes clínicos
 */

import { ClinicalReport } from '../models/index.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

/**
 * POST /api/v1/clinical-reports
 * Crear reporte clínico
 */
export const createClinicalReport = async (req, res, next) => {
  try {
    const {
      patient,
      clinic,
      therapist,
      reportType,
      fromDate,
      toDate,
      title,
      summary,
      keyFindings,
      improvements,
      areasOfConcern,
      recommendations,
      treatmentGoals,
      sessionCount,
      attachanceRate,
      overallProgress,
      clinicalObservations,
      diagnosis,
      prognosis,
      suggestedFollowUp,
    } = req.body;

    const report = await ClinicalReport.create({
      patient,
      clinic,
      therapist,
      reportType,
      fromDate,
      toDate,
      title,
      summary,
      keyFindings,
      improvements,
      areasOfConcern,
      recommendations,
      treatmentGoals,
      sessionCount,
      attachanceRate,
      overallProgress,
      clinicalObservations,
      diagnosis,
      prognosis,
      suggestedFollowUp,
      status: 'completed',
    });

    return res
      .status(201)
      .json(new ApiResponse(201, report, 'Reporte clínico creado'));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * GET /api/v1/clinical-reports/:id
 * Obtener reporte clínico
 */
export const getClinicalReport = async (req, res, next) => {
  try {
    const report = await ClinicalReport.findById(req.params.id)
      .populate('patient', 'firstName lastName')
      .populate('therapist', 'user')
      .populate('clinic', 'name')
      .populate('reviewedBy', 'firstName lastName');

    if (!report) {
      return next(new AppError('Reporte no encontrado', 404));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, report, 'Reporte obtenido'));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * GET /api/v1/patients/:patientId/clinical-reports
 * Listar reportes de paciente
 */
export const getPatientClinicalReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, reportType } = req.query;
    const skip = (page - 1) * limit;

    const query = { patient: req.params.patientId };
    if (reportType) query.reportType = reportType;

    const reports = await ClinicalReport.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ reportDate: -1 });

    const total = await ClinicalReport.countDocuments(query);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { reports, total, page, pages: Math.ceil(total / limit) },
          'Reportes obtenidos',
        ),
      );
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * PUT /api/v1/clinical-reports/:id
 * Actualizar reporte clínico
 */
export const updateClinicalReport = async (req, res, next) => {
  try {
    const report = await ClinicalReport.findById(req.params.id);

    if (!report) {
      return next(new AppError('Reporte no encontrado', 404));
    }

    if (!report.canEdit()) {
      return next(
        new AppError('No se puede editar un reporte completado', 400),
      );
    }

    const updateData = { ...req.body };
    Object.assign(report, updateData);

    await report.save();

    return res
      .status(200)
      .json(new ApiResponse(200, report, 'Reporte actualizado'));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * POST /api/v1/clinical-reports/:id/review
 * Revisar reporte clínico
 */
export const reviewClinicalReport = async (req, res, next) => {
  try {
    const report = await ClinicalReport.findById(req.params.id);

    if (!report) {
      return next(new AppError('Reporte no encontrado', 404));
    }

    await report.markAsReviewed(req.user.id);

    return res
      .status(200)
      .json(new ApiResponse(200, report, 'Reporte marcado como revisado'));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * DELETE /api/v1/clinical-reports/:id
 * Eliminar reporte clínico
 */
export const deleteClinicalReport = async (req, res, next) => {
  try {
    const report = await ClinicalReport.findByIdAndDelete(req.params.id);

    if (!report) {
      return next(new AppError('Reporte no encontrado', 404));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Reporte eliminado'));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * GET /api/v1/clinics/:clinicId/clinical-reports
 * Listar reportes por clínica
 */
export const getClinicClinicalReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, reportType, therapistId } = req.query;
    const skip = (page - 1) * limit;

    const query = { clinic: req.params.clinicId };
    if (reportType) query.reportType = reportType;
    if (therapistId) query.therapist = therapistId;

    const reports = await ClinicalReport.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ reportDate: -1 });

    const total = await ClinicalReport.countDocuments(query);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { reports, total, page, pages: Math.ceil(total / limit) },
          'Reportes obtenidos',
        ),
      );
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
