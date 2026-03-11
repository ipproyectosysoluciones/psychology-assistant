/**
 * Therapist Model - Psicólogo/Terapeuta
 * Profesional de salud mental en la clínica
 */

import mongoose from 'mongoose';

const therapistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
      required: true,
    },
    specializations: {
      type: [String],
      default: [],
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    licenseExpiry: {
      type: Date,
      required: true,
    },
    bio: {
      type: String,
      maxlength: 1000,
    },
    qualifications: {
      type: [String],
      default: [],
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    availability: {
      monday: [{ start: String, end: String }],
      tuesday: [{ start: String, end: String }],
      wednesday: [{ start: String, end: String }],
      thursday: [{ start: String, end: String }],
      friday: [{ start: String, end: String }],
      saturday: [{ start: String, end: String }],
      sunday: [{ start: String, end: String }],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on_leave'],
      default: 'active',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    languages: {
      type: [String],
      default: ['Español'],
    },
    profileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

therapistSchema.index({ clinic: 1 });
therapistSchema.index({ user: 1 });
therapistSchema.index({ status: 1 });
// licenseNumber index: Removed - unique: true already creates index

therapistSchema.methods.isLicenseValid = function () {
  return new Date() < this.licenseExpiry;
};

therapistSchema.methods.canTakeAppointments = function () {
  return this.status === 'active' && this.isLicenseValid();
};

export const Therapist = mongoose.model('Therapist', therapistSchema);
