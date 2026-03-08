import { Schema, model } from 'mongoose';

const appointmentSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    psychologist: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
      validate: {
        validator: function (v) {
          // Allow future dates, be lenient with timing issues
          return v > new Date(Date.now() - 5000);
        },
        message: 'Appointment date must be in the future'
      }
    },
    duration: {
      type: Number, // en minutos
      default: 60,
      min: [15, 'Duration must be at least 15 minutes'],
      max: [180, 'Duration cannot exceed 180 minutes']
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled'
    },
    qrCode: String,
    reminderSent: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Índices
appointmentSchema.index({ user: 1, date: -1 });
appointmentSchema.index({ psychologist: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ date: 1 });

// Populate automático
appointmentSchema.pre(/^find/, function (next) {
  this.populate('user', 'name email');
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: 'psychologist',
    select: 'name email role'
  });
  next();
});

export const Appointment = model('Appointment', appointmentSchema);
