import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Appointment status types
 */
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show';

/**
 * Appointment interface
 */
export interface IAppointment {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  psychologist?: mongoose.Types.ObjectId;
  date: Date;
  duration: number;
  description: string;
  notes?: string;
  status: AppointmentStatus;
  qrCode?: string;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Appointment document interface
 */
export interface IAppointmentDocument extends IAppointment, Document {
  _id: mongoose.Types.ObjectId;
}

/**
 * Appointment model type
 */
export type IAppointmentModel = Model<IAppointmentDocument>;

const appointmentSchema = new Schema<IAppointmentDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    psychologist: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
      validate: {
        validator: function (v: Date) {
          return v > new Date(Date.now() - 5000);
        },
        message: 'Appointment date must be in the future',
      },
    },
    duration: {
      type: Number,
      default: 60,
      min: [15, 'Duration must be at least 15 minutes'],
      max: [180, 'Duration cannot exceed 180 minutes'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    qrCode: String,
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Índices
appointmentSchema.index({ user: 1, date: -1 });
appointmentSchema.index({ psychologist: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ date: 1 });

export const Appointment = mongoose.model<IAppointmentDocument, IAppointmentModel>(
  'Appointment',
  appointmentSchema
);
