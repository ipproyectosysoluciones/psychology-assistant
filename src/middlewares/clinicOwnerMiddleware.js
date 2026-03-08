/**
 * Clinic Owner Middleware
 * Valida que el usuario tenga acceso a la clínica
 */

import { Clinic } from '../models/index.js';
import { AppError } from '../utils/apiResponse.js';

export const validateClinicOwnership = async (req, res, next) => {
  try {
    const clinicId = req.params.clinicId || req.body.clinic;

    if (!clinicId) {
      return next(new AppError('Clinic ID is required', 400));
    }

    const clinic = await Clinic.findById(clinicId);

    if (!clinic) {
      return next(new AppError('Clínica no encontrada', 404));
    }

    if (!clinic.isAdmin(req.user.id)) {
      return next(
        new AppError('No tienes permisos para acceder a esta clínica', 403)
      );
    }

    req.clinic = clinic;
    next();
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

export const validateClinicAccess = async (req, res, next) => {
  try {
    const clinicId = req.params.clinicId || req.body.clinic;

    if (!clinicId) {
      return next(new AppError('Clinic ID is required', 400));
    }

    const clinic = await Clinic.findById(clinicId);

    if (!clinic) {
      return next(new AppError('Clínica no encontrada', 404));
    }

    if (!clinic.isAdmin(req.user.id)) {
      return next(new AppError('No tienes acceso a esta clínica', 403));
    }

    req.clinic = clinic;
    next();
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

export const validateOptionalClinicAccess = async (req, res, next) => {
  try {
    const clinicId = req.params.clinicId;

    if (clinicId) {
      const clinic = await Clinic.findById(clinicId);

      if (!clinic) {
        return next(new AppError('Clínica no encontrada', 404));
      }

      if (!clinic.isAdmin(req.user.id)) {
        return next(new AppError('No tienes acceso a esta clínica', 403));
      }

      req.clinic = clinic;
    }

    next();
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
