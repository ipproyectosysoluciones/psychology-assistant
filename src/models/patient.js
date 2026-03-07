/**
 * Patient Model - Paciente/Cliente
 * Persona que recibe servicios de salud mental
 */

import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['M', 'F', 'Other', 'Prefer not to say'],
    required: true
  },
  idType: {
    type: String,
    enum: ['CC', 'TI', 'CE', 'PA', 'RC'],
    required: true
  },
  idNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  insurance: {
    type: String,
    trim: true
  },
  insurancePlan: {
    type: String,
    trim: true
  },
  employmentStatus: {
    type: String,
    enum: ['employed', 'self-employed', 'student', 'unemployed', 'retired'],
    default: 'employed'
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  medicalHistory: {
    type: String,
    maxlength: 2000
  },
  allergies: {
    type: [String],
    default: []
  },
  medications: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'paused'],
    default: 'active'
  },
  preferredTherapist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Therapist'
  },
  notes: {
    type: String,
    maxlength: 1000
  }
},
{
  timestamps: true
});

patientSchema.index({ clinic: 1 });
patientSchema.index({ user: 1 });
patientSchema.index({ status: 1 });
patientSchema.index({ idNumber: 1 });

patientSchema.methods.getAge = function() {
  const today = new Date();
  let age = today.getFullYear() - this.dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())) {
    age--;
  }
  return age;
};

patientSchema.methods.canScheduleAppointment = function() {
  return this.status === 'active';
};

export const Patient = mongoose.model('Patient', patientSchema);
