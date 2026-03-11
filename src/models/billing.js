/**
 * Billing Model - Facturación
 * Gestión de pagos y facturas por servicios
 */

import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
      required: true
    },
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    invoiceNumber: {
      type: String,
      unique: true,
      required: true
    },
    invoiceDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'COP'
    },
    description: {
      type: String,
      required: true
    },
    lineItems: [
      {
        description: String,
        quantity: Number,
        unitPrice: Number,
        total: Number
      },
    ],
    discount: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'transfer', 'check', 'insurance'],
      default: 'cash'
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
      default: 'draft'
    },
    paymentDate: {
      type: Date
    },
    notes: {
      type: String,
      maxlength: 500
    },
    insurance: {
      type: String
    },
  },
  {
    timestamps: true
  },
);

billingSchema.index({ patient: 1, clinic: 1 });
// invoiceNumber index: Removed - unique: true already creates index
billingSchema.index({ status: 1 });
billingSchema.index({ paymentDate: -1 });

billingSchema.methods.isPaid = function () {
  return this.status === 'paid';
};

billingSchema.methods.calculateTotal = function () {
  const subtotal = this.lineItems.reduce(
    (sum, item) => sum + (item.total || 0),
    0
  );
  return subtotal - this.discount + this.tax;
};

billingSchema.methods.markAsPaid = function () {
  this.status = 'paid';
  this.paymentDate = new Date();
  return this.save();
};

export const Billing = mongoose.model('Billing', billingSchema);
