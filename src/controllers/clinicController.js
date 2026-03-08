/**
 * Clinic Controller
 * Gestiona endpoints de clínicas
 */

import { Clinic } from '../models/index.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

/**
 * POST /api/v1/clinics
 * Crear una nueva clínica
 */
export const createClinic = async (req, res, next) => {
  try {
    const {
      name,
      description,
      address,
      phone,
      email,
      website,
      country,
      currency
    } = req.body;

    const clinic = await Clinic.create({
      name,
      description,
      address,
      phone,
      email,
      website,
      country,
      currency,
      owner: req.user.id
    });

    return res
      .status(201)
      .json(new ApiResponse(201, clinic, 'Clínica creada exitosamente'));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * GET /api/v1/clinics/:id
 * Obtener detalles de una clínica
 */
export const getClinic = async (req, res, next) => {
  try {
    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) {
      return next(new AppError('Clínica no encontrada', 404));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, clinic, 'Clínica obtenida exitosamente'));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * GET /api/v1/clinics/user/:userId
 * Obtener clínicas del usuario
 */
export const getClinicsByUser = async (req, res, next) => {
  try {
    const clinics = await Clinic.find({ owner: req.params.userId });

    return res
      .status(200)
      .json(new ApiResponse(200, clinics, 'Clínicas obtenidas exitosamente'));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * PUT /api/v1/clinics/:id
 * Actualizar clínica
 */
export const updateClinic = async (req, res, next) => {
  try {
    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) {
      return next(new AppError('Clínica no encontrada', 404));
    }

    if (!clinic.isAdmin(req.user.id)) {
      return next(
        new AppError('No tienes permisos para actualizar esta clínica', 403)
      );
    }

    const {
      name,
      description,
      address,
      phone,
      email,
      website,
      status,
      settings
    } = req.body;

    if (name) clinic.name = name;
    if (description) clinic.description = description;
    if (address) clinic.address = address;
    if (phone) clinic.phone = phone;
    if (email) clinic.email = email;
    if (website) clinic.website = website;
    if (status) clinic.status = status;
    if (settings) clinic.settings = { ...clinic.settings, ...settings };

    await clinic.save();

    return res
      .status(200)
      .json(new ApiResponse(200, clinic, 'Clínica actualizada exitosamente'));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * DELETE /api/v1/clinics/:id
 * Eliminar clínica
 */
export const deleteClinic = async (req, res, next) => {
  try {
    const clinic = await Clinic.findByIdAndDelete(req.params.id);

    if (!clinic) {
      return next(new AppError('Clínica no encontrada', 404));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Clínica eliminada exitosamente'));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * POST /api/v1/clinics/:id/admins/:userId
 * Agregar admin a clínica
 */
export const addClinicAdmin = async (req, res, next) => {
  try {
    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) {
      return next(new AppError('Clínica no encontrada', 404));
    }

    if (!clinic.isAdmin(req.user.id)) {
      return next(new AppError('No tienes permisos', 403));
    }

    await clinic.addAdmin(req.params.userId);

    return res
      .status(200)
      .json(new ApiResponse(200, clinic, 'Admin agregado exitosamente'));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * DELETE /api/v1/clinics/:id/admins/:userId
 * Remover admin de clínica
 */
export const removeClinicAdmin = async (req, res, next) => {
  try {
    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) {
      return next(new AppError('Clínica no encontrada', 404));
    }

    if (!clinic.isAdmin(req.user.id)) {
      return next(new AppError('No tienes permisos', 403));
    }

    await clinic.removeAdmin(req.params.userId);

    return res
      .status(200)
      .json(new ApiResponse(200, clinic, 'Admin removido exitosamente'));
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

/**
 * GET /api/v1/clinics
 * Listar todas las clínicas (admin)
 */
export const getAllClinics = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;

    const clinics = await Clinic.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Clinic.countDocuments(query);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { clinics, total, page, pages: Math.ceil(total / limit) },
          'Clínicas obtenidas'
        )
      );
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
