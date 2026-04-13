import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Billing status types
 */
export type BillingStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

/**
 * Payment method types
 */
export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'check' | 'insurance';

/**
 * Line item interface
 */
export interface ILineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

/**
 * Billing interface
 */
export interface IBilling {
  _id: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  clinic: mongoose.Types.ObjectId;
  therapist: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate?: Date;
  amount: number;
  currency: string;
  description: string;
  lineItems: ILineItem[];
  discount: number;
  tax: number;
  paymentMethod: PaymentMethod;
  status: BillingStatus;
  paymentDate?: Date;
  notes?: string;
  insurance?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Billing document interface
 */
export interface IBillingDocument extends IBilling, Document {
  _id: mongoose.Types.ObjectId;
  isPaid(): boolean;
  calculateTotal(): number;
  markAsPaid(): Promise<this>;
}

/**
 * Billing model type
 */
export type IBillingModel = Model<IBillingDocument>;

const billingSchema = new Schema<IBillingDocument>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    clinic: {
      type: Schema.Types.ObjectId,
      ref: 'Clinic',
      required: true,
    },
    therapist: {
      type: Schema.Types.ObjectId,
      ref: 'Therapist',
      required: true,
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    invoiceNumber: {
      type: String,
      unique: true,
      required: true,
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'COP',
    },
    description: {
      type: String,
      required: true,
    },
    lineItems: [
      {
        description: String,
        quantity: Number,
        unitPrice: Number,
        total: Number,
      },
    ],
    discount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'transfer', 'check', 'insurance'],
      default: 'cash',
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
      default: 'draft',
    },
    paymentDate: {
      type: Date,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    insurance: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

billingSchema.index({ patient: 1, clinic: 1 });
billingSchema.index({ status: 1 });
billingSchema.index({ paymentDate: -1 });

billingSchema.methods.isPaid = function () {
  return this.status === 'paid';
};

billingSchema.methods.calculateTotal = function (): number {
  const subtotal = this.lineItems.reduce(
    (sum: number, item: ILineItem) => sum + (item.total || 0),
    0
  );
  return subtotal - this.discount + this.tax;
};

billingSchema.methods.markAsPaid = async function (): Promise<IBillingDocument> {
  this.status = 'paid';
  this.paymentDate = new Date();
  return this.save();
};

export const Billing = mongoose.model<IBillingDocument, IBillingModel>('Billing', billingSchema);
