/**
 * Billing Controller
 * Gestiona endpoints de facturación
 */

import { Request, Response, NextFunction } from 'express';
import { Billing } from '../models/index.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { AppError } from '../utils/appError.js';

/**
 * POST /api/v1/billings
 * Crear factura
 */
export const createBilling = async (
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
      amount,
      description,
      lineItems,
      discount,
      tax,
      paymentMethod,
      insurance,
    } = req.body;

    const invoiceNumber = `INV-${Date.now()}`;

    const billing = await Billing.create({
      patient,
      clinic,
      therapist,
      appointment,
      invoiceNumber,
      amount,
      description,
      lineItems,
      discount: discount || 0,
      tax: tax || 0,
      paymentMethod,
      insurance,
      status: 'draft',
    });

    res.status(201).json(new ApiResponse(201, billing, 'Factura creada'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * GET /api/v1/billings/:id
 * Obtener factura
 */
export const getBilling = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const billing = await Billing.findById(req.params.id)
      .populate('patient', 'firstName lastName')
      .populate('therapist', 'user')
      .populate('clinic', 'name');

    if (!billing) {
      return next(new AppError('Factura no encontrada', 404));
    }

    res.status(200).json(new ApiResponse(200, billing, 'Factura obtenida'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * GET /api/v1/patients/:patientId/billings
 * Listar facturas de paciente
 */
export const getPatientBillings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const query: Record<string, unknown> = { patient: req.params.patientId };
    if (status) query.status = status;

    const billings = await Billing.find(query).skip(skip).limit(limitNum).sort({ invoiceDate: -1 });

    const total = await Billing.countDocuments(query);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { billings, total, page: pageNum, pages: Math.ceil(total / limitNum) },
          'Facturas obtenidas'
        )
      );
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * PUT /api/v1/billings/:id
 * Actualizar factura
 */
export const updateBilling = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const billing = await Billing.findById(req.params.id);

    if (!billing) {
      return next(new AppError('Factura no encontrada', 404));
    }

    if ((billing as unknown as Record<string, unknown> & typeof billing).isPaid()) {
      return next(new AppError('No se puede editar una factura pagada', 400));
    }

    const { amount, description, lineItems, discount, tax, paymentMethod, status } = req.body;

    if (amount) billing.amount = amount;
    if (description) billing.description = description;
    if (lineItems) billing.lineItems = lineItems;
    if (discount !== undefined) billing.discount = discount;
    if (tax !== undefined) billing.tax = tax;
    if (paymentMethod) billing.paymentMethod = paymentMethod;
    if (status) billing.status = status;

    await billing.save();

    res.status(200).json(new ApiResponse(200, billing, 'Factura actualizada'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * POST /api/v1/billings/:id/pay
 * Marcar factura como pagada
 */
export const markBillingAsPaid = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const billing = await Billing.findById(req.params.id);

    if (!billing) {
      return next(new AppError('Factura no encontrada', 404));
    }

    await (billing as unknown as Record<string, unknown> & typeof billing).markAsPaid();

    res.status(200).json(new ApiResponse(200, billing, 'Factura marcada como pagada'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * DELETE /api/v1/billings/:id
 * Eliminar factura
 */
export const deleteBilling = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const billing = await Billing.findByIdAndDelete(req.params.id);

    if (!billing) {
      return next(new AppError('Factura no encontrada', 404));
    }

    res.status(200).json(new ApiResponse(200, null, 'Factura eliminada'));
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};

/**
 * GET /api/v1/clinics/:clinicId/billings
 * Listar facturas por clínica
 */
export const getClinicBillings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const query: Record<string, unknown> = { clinic: req.params.clinicId };
    if (status) query.status = status;

    const billings = await Billing.find(query).skip(skip).limit(limitNum).sort({ invoiceDate: -1 });

    const total = await Billing.countDocuments(query);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { billings, total, page: pageNum, pages: Math.ceil(total / limitNum) },
          'Facturas obtenidas'
        )
      );
  } catch (error) {
    return next(new AppError((error as Error).message, 400));
  }
};
