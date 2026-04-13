/**
 * Clinical Report Controller
 * Gestiona endpoints de reportes clínicos
 */

import { Request, Response, NextFunction } from 'express';
import { ClinicalReport } from '../models/index.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

/**
 * POST /api/v1/clinical-reports
 * Crear reporte clínico
 */
export const createClinicalReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
      attackanceRate,
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
      attackanceRate,
      overallProgress,
      clinicalObservations,
      diagnosis,
      prognosis,
      suggestedFollowUp,
      status: 'completed',
    });

    res.status(201).json(new ApiResponse(201, report, 'Reporte clínico creado'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * GET /api/v1/clinical-reports/:id
 * Obtener reporte clínico
 */
export const getClinicalReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const report = await ClinicalReport.findById(req.params.id)
      .populate('patient', 'firstName lastName')
      .populate('therapist', 'user')
      .populate('clinic', 'name')
      .populate('reviewedBy', 'firstName lastName');

    if (!report) {
      return next(new AppError('Reporte no encontrado', 404));
    }

    res.status(200).json(new ApiResponse(200, report, 'Reporte obtenido'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * GET /api/v1/patients/:patientId/clinical-reports
 * Listar reportes de paciente
 */
export const getPatientClinicalReports = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, reportType } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const query: Record<string, unknown> = { patient: req.params.patientId };
    if (reportType) query.reportType = reportType;

    const reports = await ClinicalReport.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ reportDate: -1 });

    const total = await ClinicalReport.countDocuments(query);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { reports, total, page: pageNum, pages: Math.ceil(total / limitNum) },
          'Reportes obtenidos'
        )
      );
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * PUT /api/v1/clinical-reports/:id
 * Actualizar reporte clínico
 */
export const updateClinicalReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const report = await ClinicalReport.findById(req.params.id);

    if (!report) {
      return next(new AppError('Reporte no encontrado', 404));
    }

    if (!(report as unknown as Record<string, unknown> & typeof report).canEdit()) {
      return next(new AppError('No se puede editar un reporte completado', 400));
    }

    const updateData = { ...req.body };
    Object.assign(report, updateData);

    await report.save();

    res.status(200).json(new ApiResponse(200, report, 'Reporte actualizado'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * POST /api/v1/clinical-reports/:id/review
 * Revisar reporte clínico
 */
export const reviewClinicalReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const report = await ClinicalReport.findById(req.params.id);

    if (!report) {
      return next(new AppError('Reporte no encontrado', 404));
    }

    await (report as unknown as Record<string, unknown> & typeof report).markAsReviewed(
      req.user!._id
    );

    res.status(200).json(new ApiResponse(200, report, 'Reporte marcado como revisado'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * DELETE /api/v1/clinical-reports/:id
 * Eliminar reporte clínico
 */
export const deleteClinicalReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const report = await ClinicalReport.findByIdAndDelete(req.params.id);

    if (!report) {
      return next(new AppError('Reporte no encontrado', 404));
    }

    res.status(200).json(new ApiResponse(200, null, 'Reporte eliminado'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * GET /api/v1/clinics/:clinicId/clinical-reports
 * Listar reportes por clínica
 */
export const getClinicClinicalReports = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, reportType, therapistId } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const query: Record<string, unknown> = { clinic: req.params.clinicId };
    if (reportType) query.reportType = reportType;
    if (therapistId) query.therapist = therapistId;

    const reports = await ClinicalReport.find(query)
      .skip(skip)
      .limit(limitNum)
      .sort({ reportDate: -1 });

    const total = await ClinicalReport.countDocuments(query);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { reports, total, page: pageNum, pages: Math.ceil(total / limitNum) },
          'Reportes obtenidos'
        )
      );
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};
