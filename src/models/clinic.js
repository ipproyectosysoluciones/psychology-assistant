/**
 * Clinic Model - Consultorio/Clínica Psicológica
 * Unidad base de la jerarquía del CRM
 */

import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    website: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      default: 'Colombia',
    },
    currency: {
      type: String,
      default: 'COP',
      enum: ['COP', 'USD', 'ARS', 'MXN', 'CLP', 'PEN'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    admins: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    logo: {
      type: String,
      trim: true,
    },
    settings: {
      appointmentDuration: {
        type: Number,
        default: 60,
        min: 15,
      },
      cancellationPolicy: {
        type: String,
        default: '24',
      },
      timezone: {
        type: String,
        default: 'America/Bogota',
      },
    },
  },
  {
    timestamps: true,
  },
);

// Índices
clinicSchema.index({ owner: 1 });
clinicSchema.index({ email: 1 }, { unique: true });
clinicSchema.index({ status: 1 });

// Método para validar si usuario es admin
clinicSchema.methods.isAdmin = function (userId) {
  return (
    this.owner.equals(userId) ||
    this.admins.some((admin) => admin.equals(userId))
  );
};

// Método para agregar admin
clinicSchema.methods.addAdmin = function (userId) {
  if (!this.admins.includes(userId) && !this.owner.equals(userId)) {
    this.admins.push(userId);
  }
  return this.save();
};

// Método para remover admin
clinicSchema.methods.removeAdmin = function (userId) {
  this.admins = this.admins.filter((admin) => !admin.equals(userId));
  return this.save();
};

export const Clinic = mongoose.model('Clinic', clinicSchema);
