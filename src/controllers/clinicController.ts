/**
 * Clinic Controller
 * Gestiona endpoints de clínicas
 */

import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Clinic } from '../models/index.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

/**
 * POST /api/v1/clinics
 * Crear una nueva clínica
 */
export const createClinic = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, address, phone, email, website, country, currency } = req.body;

    const clinic = await Clinic.create({
      name,
      description,
      address,
      phone,
      email,
      website,
      country,
      currency,
      owner: req.user!._id,
    });

    res.status(201).json(new ApiResponse(201, clinic, 'Clínica creada exitosamente'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * GET /api/v1/clinics/:id
 * Obtener detalles de una clínica
 */
export const getClinic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) {
      return next(new AppError('Clínica no encontrada', 404));
    }

    res.status(200).json(new ApiResponse(200, clinic, 'Clínica obtenida exitosamente'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * GET /api/v1/clinics/user/:userId
 * Obtener clínicas del usuario
 */
export const getClinicsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clinics = await Clinic.find({ owner: req.params.userId });

    res.status(200).json(new ApiResponse(200, clinics, 'Clínicas obtenidas exitosamente'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * PUT /api/v1/clinics/:id
 * Actualizar clínica
 */
export const updateClinic = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) {
      return next(new AppError('Clínica no encontrada', 404));
    }

    if (!(clinic as unknown as Record<string, unknown> & typeof clinic).isAdmin(req.user!._id)) {
      return next(new AppError('No tienes permisos para actualizar esta clínica', 403));
    }

    const { name, description, address, phone, email, website, status, settings } = req.body;

    if (name) clinic.name = name;
    if (description) clinic.description = description;
    if (address) clinic.address = address;
    if (phone) clinic.phone = phone;
    if (email) clinic.email = email;
    if (website) clinic.website = website;
    if (status) clinic.status = status;
    if (settings) clinic.settings = { ...clinic.settings, ...settings };

    await clinic.save();

    res.status(200).json(new ApiResponse(200, clinic, 'Clínica actualizada exitosamente'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * DELETE /api/v1/clinics/:id
 * Eliminar clínica
 */
export const deleteClinic = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clinic = await Clinic.findByIdAndDelete(req.params.id);

    if (!clinic) {
      return next(new AppError('Clínica no encontrada', 404));
    }

    res.status(200).json(new ApiResponse(200, null, 'Clínica eliminada exitosamente'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * POST /api/v1/clinics/:id/admins/:userId
 * Agregar admin a clínica
 */
export const addClinicAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) {
      return next(new AppError('Clínica no encontrada', 404));
    }

    if (!(clinic as unknown as Record<string, unknown> & typeof clinic).isAdmin(req.user!._id)) {
      return next(new AppError('No tienes permisos', 403));
    }

    await (clinic as unknown as Record<string, unknown> & typeof clinic).addAdmin(
      new mongoose.Types.ObjectId(req.params.userId)
    );

    res.status(200).json(new ApiResponse(200, clinic, 'Admin agregado exitosamente'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * DELETE /api/v1/clinics/:id/admins/:userId
 * Remover admin de clínica
 */
export const removeClinicAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) {
      return next(new AppError('Clínica no encontrada', 404));
    }

    if (!(clinic as unknown as Record<string, unknown> & typeof clinic).isAdmin(req.user!._id)) {
      return next(new AppError('No tienes permisos', 403));
    }

    await (clinic as unknown as Record<string, unknown> & typeof clinic).removeAdmin(
      new mongoose.Types.ObjectId(req.params.userId)
    );

    res.status(200).json(new ApiResponse(200, clinic, 'Admin removido exitosamente'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * GET /api/v1/clinics
 * Listar todas las clínicas (admin)
 */
export const getAllClinics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const query: Record<string, unknown> = {};
    if (status) query.status = status;

    const clinics = await Clinic.find(query).skip(skip).limit(limitNum).sort({ createdAt: -1 });

    const total = await Clinic.countDocuments(query);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { clinics, total, page: pageNum, pages: Math.ceil(total / limitNum) },
          'Clínicas obtenidas'
        )
      );
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};
