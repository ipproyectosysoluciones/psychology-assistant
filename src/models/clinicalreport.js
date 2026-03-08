/**
 * Clinical Report Model - Reportes Clínicos
 * Reportes automáticos y estadísticas de pacientes
 */

import mongoose from 'mongoose';

const clinicalReportSchema = new mongoose.Schema(
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
    reportType: {
      type: String,
      enum: ['progress', 'discharge', 'assessment', 'evaluation', 'summary'],
      required: true
    },
    reportDate: {
      type: Date,
      default: Date.now
    },
    fromDate: {
      type: Date,
      required: true
    },
    toDate: {
      type: Date,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      maxlength: 1000,
      required: true
    },
    keyFindings: {
      type: [String],
      default: []
    },
    improvements: {
      type: [String],
      default: []
    },
    areasOfConcern: {
      type: [String],
      default: []
    },
    recommendations: {
      type: [String],
      default: []
    },
    treatmentGoals: {
      type: [String],
      default: []
    },
    sessionCount: {
      type: Number,
      default: 0
    },
    attackanceRate: {
      type: Number,
      min: 0,
      max: 100
    },
    overallProgress: {
      type: Number,
      min: 1,
      max: 10
    },
    clinicalObservations: {
      type: String,
      maxlength: 2000
    },
    diagnosis: {
      type: String,
      required: true
    },
    prognosis: {
      type: String,
      maxlength: 1000
    },
    suggestedFollowUp: {
      type: String,
      enum: [
        'continue',
        'reduce_frequency',
        'increase_frequency',
        'discharge',
        'referral'
      ],
      default: 'continue'
    },
    nextAppointmentDate: {
      type: Date
    },
    attachments: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ['draft', 'completed', 'reviewed', 'archived'],
      default: 'completed'
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewDate: {
      type: Date
    },
    isConfidential: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

clinicalReportSchema.index({ patient: 1, clinic: 1 });
clinicalReportSchema.index({ therapist: 1 });
clinicalReportSchema.index({ reportDate: -1 });
clinicalReportSchema.index({ reportType: 1 });

clinicalReportSchema.methods.isDraft = function () {
  return this.status === 'draft';
};

clinicalReportSchema.methods.canEdit = function () {
  return this.status === 'draft';
};

clinicalReportSchema.methods.markAsReviewed = function (reviewerId) {
  this.status = 'reviewed';
  this.reviewedBy = reviewerId;
  this.reviewDate = new Date();
  return this.save();
};

export const ClinicalReport = mongoose.model(
  'ClinicalReport',
  clinicalReportSchema
);
