/**
 * Medical Record Model - Historial Clínico
 * Registro de diagnósticos, tratamientos y progreso
 */

import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema(
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
    recordDate: {
      type: Date,
      default: Date.now
    },
    diagnosisCIE10: {
      type: [String],
      default: []
    },
    primaryDiagnosis: {
      type: String,
      required: true
    },
    secondaryDiagnosis: {
      type: [String],
      default: []
    },
    symptoms: {
      type: [String],
      default: []
    },
    treatmentPlan: {
      type: String,
      maxlength: 2000
    },
    interventions: {
      type: [String],
      default: []
    },
    clinicalNotes: {
      type: String,
      maxlength: 3000,
      required: true
    },
    progressRating: {
      type: Number,
      min: 1,
      max: 10
    },
    nextSteps: {
      type: String,
      maxlength: 1000
    },
    medications: {
      type: [String],
      default: []
    },
    referrals: {
      type: [String],
      default: []
    },
    attachments: {
      type: [String],
      default: []
    },
    isConfidential: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['draft', 'completed', 'archived'],
      default: 'completed'
    }
  },
  {
    timestamps: true
  }
);

medicalRecordSchema.index({ patient: 1, clinic: 1 });
medicalRecordSchema.index({ therapist: 1 });
medicalRecordSchema.index({ recordDate: -1 });
medicalRecordSchema.index({ status: 1 });

medicalRecordSchema.methods.isDraft = function () {
  return this.status === 'draft';
};

medicalRecordSchema.methods.canEdit = function () {
  return this.status === 'draft';
};

export const MedicalRecord = mongoose.model(
  'MedicalRecord',
  medicalRecordSchema
);
