import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Medical record status types
 */
export type MedicalRecordStatus = 'draft' | 'completed' | 'archived';

/**
 * Medical record interface
 */
export interface IMedicalRecord {
  _id: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  clinic: mongoose.Types.ObjectId;
  therapist: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  recordDate: Date;
  diagnosisCIE10: string[];
  primaryDiagnosis: string;
  secondaryDiagnosis: string[];
  symptoms: string[];
  treatmentPlan?: string;
  interventions: string[];
  clinicalNotes: string;
  progressRating?: number;
  nextSteps?: string;
  medications: string[];
  referrals: string[];
  attachments: string[];
  isConfidential: boolean;
  status: MedicalRecordStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Medical record document interface
 */
export interface IMedicalRecordDocument extends IMedicalRecord, Document {
  _id: mongoose.Types.ObjectId;
  isDraft(): boolean;
  canEdit(): boolean;
}

/**
 * Medical record model type
 */
export type IMedicalRecordModel = Model<IMedicalRecordDocument>;

const medicalRecordSchema = new Schema<IMedicalRecordDocument>(
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
    recordDate: {
      type: Date,
      default: Date.now,
    },
    diagnosisCIE10: {
      type: [String],
      default: [],
    },
    primaryDiagnosis: {
      type: String,
      required: true,
    },
    secondaryDiagnosis: {
      type: [String],
      default: [],
    },
    symptoms: {
      type: [String],
      default: [],
    },
    treatmentPlan: {
      type: String,
      maxlength: 2000,
    },
    interventions: {
      type: [String],
      default: [],
    },
    clinicalNotes: {
      type: String,
      maxlength: 3000,
      required: true,
    },
    progressRating: {
      type: Number,
      min: 1,
      max: 10,
    },
    nextSteps: {
      type: String,
      maxlength: 1000,
    },
    medications: {
      type: [String],
      default: [],
    },
    referrals: {
      type: [String],
      default: [],
    },
    attachments: {
      type: [String],
      default: [],
    },
    isConfidential: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['draft', 'completed', 'archived'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
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

export const MedicalRecord = mongoose.model<IMedicalRecordDocument, IMedicalRecordModel>(
  'MedicalRecord',
  medicalRecordSchema
);
