/**
 * Therapist Controller
 * Gestiona endpoints de terapeutas
 */

import { Therapist } from '../models/index.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

/**
 * POST /api/v1/therapists
 * Crear terapeuta
 */
export const createTherapist = async (req, res, next) => {
  try {
    const {
      clinic,
      user,
      specializations,
      licenseNumber,
      licenseExpiry,
      hourlyRate,
      bio
    } = req.body;

    const existingTherapist = await Therapist.findOne({ licenseNumber });
    if (existingTherapist) {
      return next(new AppError('El número de licencia ya existe', 400));
    }

    const therapist = await Therapist.create({
      clinic,
      user,
      specializations,
      licenseNumber,
      licenseExpiry,
      hourlyRate,
      bio
    });

    return res
      .status(201)
      .json(new ApiResponse(201, therapist, 'Terapeuta creado exitosamente'));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * GET /api/v1/therapists/:id
 * Obtener detalles de terapeuta
 */
export const getTherapist = async (req, res, next) => {
  try {
    const therapist = await Therapist.findById(req.params.id)
      .populate('user', 'firstName lastName email')
      .populate('clinic', 'name');

    if (!therapist) {
      return next(new AppError('Terapeuta no encontrado', 404));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, therapist, 'Terapeuta obtenido'));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * GET /api/v1/clinics/:clinicId/therapists
 * Listar terapeutas por clínica
 */
export const getTherapistsByClinic = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    const skip = (page - 1) * limit;

    const therapists = await Therapist.find({
      clinic: req.params.clinicId,
      status
    })
      .populate('user', 'firstName lastName email')
      .skip(skip)
      .limit(limit);

    const total = await Therapist.countDocuments({
      clinic: req.params.clinicId,
      status
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { therapists, total, page, pages: Math.ceil(total / limit) },
          'Terapeutas obtenidos'
        )
      );
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * PUT /api/v1/therapists/:id
 * Actualizar terapeuta
 */
export const updateTherapist = async (req, res, next) => {
  try {
    const { specializations, hourlyRate, bio, status, availability } = req.body;

    const therapist = await Therapist.findByIdAndUpdate(
      req.params.id,
      { specializations, hourlyRate, bio, status, availability },
      { new: true, runValidators: true }
    );

    if (!therapist) {
      return next(new AppError('Terapeuta no encontrado', 404));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, therapist, 'Terapeuta actualizado'));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * DELETE /api/v1/therapists/:id
 * Eliminar terapeuta
 */
export const deleteTherapist = async (req, res, next) => {
  try {
    const therapist = await Therapist.findByIdAndDelete(req.params.id);

    if (!therapist) {
      return next(new AppError('Terapeuta no encontrado', 404));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Terapeuta eliminado'));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * GET /api/v1/therapists/:id/availability
 * Obtener disponibilidad de terapeuta
 */
export const getTherapistAvailability = async (req, res, next) => {
  try {
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) {
      return next(new AppError('Terapeuta no encontrado', 404));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, therapist.availability, 'Disponibilidad obtenida')
      );
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * PUT /api/v1/therapists/:id/availability
 * Actualizar disponibilidad
 */
export const updateTherapistAvailability = async (req, res, next) => {
  try {
    const therapist = await Therapist.findByIdAndUpdate(
      req.params.id,
      { availability: req.body },
      { new: true }
    );

    if (!therapist) {
      return next(new AppError('Terapeuta no encontrado', 404));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          therapist.availability,
          'Disponibilidad actualizada'
        )
      );
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
