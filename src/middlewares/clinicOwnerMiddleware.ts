/**
 * Clinic Owner Middleware
 * Valida que el usuario tenga acceso a la clínica
 */

import { Request, Response, NextFunction } from 'express';
import { Clinic } from '../models/index.js';
import { AppError } from '../utils/appError.js';

export const validateClinicOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clinicId = req.params.clinicId || req.body.clinic;

    if (!clinicId) {
      return next(new AppError('Clinic ID is required', 400));
    }

    const clinic = await Clinic.findById(clinicId);

    if (!clinic) {
      return next(new AppError('Clínica no encontrada', 404));
    }

    if (
      !(
        clinic as unknown as Record<string, unknown> & { isAdmin: (id: unknown) => boolean }
      ).isAdmin(req.user!._id)
    ) {
      return next(new AppError('No tienes permisos para acceder a esta clínica', 403));
    }

    (req as unknown as Record<string, unknown>).clinic = clinic;
    next();
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

export const validateClinicAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clinicId = req.params.clinicId || req.body.clinic;

    if (!clinicId) {
      return next(new AppError('Clinic ID is required', 400));
    }

    const clinic = await Clinic.findById(clinicId);

    if (!clinic) {
      return next(new AppError('Clínica no encontrada', 404));
    }

    if (
      !(
        clinic as unknown as Record<string, unknown> & { isAdmin: (id: unknown) => boolean }
      ).isAdmin(req.user!._id)
    ) {
      return next(new AppError('No tienes acceso a esta clínica', 403));
    }

    (req as unknown as Record<string, unknown>).clinic = clinic;
    next();
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

export const validateOptionalClinicAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clinicId = req.params.clinicId;

    if (clinicId) {
      const clinic = await Clinic.findById(clinicId);

      if (!clinic) {
        return next(new AppError('Clínica no encontrada', 404));
      }

      if (
        !(
          clinic as unknown as Record<string, unknown> & { isAdmin: (id: unknown) => boolean }
        ).isAdmin(req.user!._id)
      ) {
        return next(new AppError('No tienes acceso a esta clínica', 403));
      }

      (req as unknown as Record<string, unknown>).clinic = clinic;
    }

    next();
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};
