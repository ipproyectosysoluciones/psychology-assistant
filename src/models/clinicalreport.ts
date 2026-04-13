import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Clinical report types
 */
export type ClinicalReportType = 'progress' | 'discharge' | 'assessment' | 'evaluation' | 'summary';

/**
 * Clinical report status types
 */
export type ClinicalReportStatus = 'draft' | 'completed' | 'reviewed' | 'archived';

/**
 * Suggested follow-up types
 */
export type SuggestedFollowUp =
  | 'continue'
  | 'reduce_frequency'
  | 'increase_frequency'
  | 'discharge'
  | 'referral';

/**
 * Clinical report interface
 */
export interface IClinicalReport {
  _id: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  clinic: mongoose.Types.ObjectId;
  therapist: mongoose.Types.ObjectId;
  reportType: ClinicalReportType;
  reportDate: Date;
  fromDate: Date;
  toDate: Date;
  title: string;
  summary: string;
  keyFindings: string[];
  improvements: string[];
  areasOfConcern: string[];
  recommendations: string[];
  treatmentGoals: string[];
  sessionCount: number;
  attackanceRate?: number;
  overallProgress?: number;
  clinicalObservations?: string;
  diagnosis: string;
  prognosis?: string;
  suggestedFollowUp: SuggestedFollowUp;
  nextAppointmentDate?: Date;
  attachments: string[];
  status: ClinicalReportStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewDate?: Date;
  isConfidential: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Clinical report document interface
 */
export interface IClinicalReportDocument extends IClinicalReport, Document {
  _id: mongoose.Types.ObjectId;
  isDraft(): boolean;
  canEdit(): boolean;
  markAsReviewed(reviewerId: mongoose.Types.ObjectId): Promise<this>;
}

/**
 * Clinical report model type
 */
export type IClinicalReportModel = Model<IClinicalReportDocument>;

const clinicalReportSchema = new Schema<IClinicalReportDocument>(
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
    reportType: {
      type: String,
      enum: ['progress', 'discharge', 'assessment', 'evaluation', 'summary'],
      required: true,
    },
    reportDate: {
      type: Date,
      default: Date.now,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      maxlength: 1000,
      required: true,
    },
    keyFindings: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    areasOfConcern: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    treatmentGoals: {
      type: [String],
      default: [],
    },
    sessionCount: {
      type: Number,
      default: 0,
    },
    attackanceRate: {
      type: Number,
      min: 0,
      max: 100,
    },
    overallProgress: {
      type: Number,
      min: 1,
      max: 10,
    },
    clinicalObservations: {
      type: String,
      maxlength: 2000,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    prognosis: {
      type: String,
      maxlength: 1000,
    },
    suggestedFollowUp: {
      type: String,
      enum: ['continue', 'reduce_frequency', 'increase_frequency', 'discharge', 'referral'],
      default: 'continue',
    },
    nextAppointmentDate: {
      type: Date,
    },
    attachments: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'completed', 'reviewed', 'archived'],
      default: 'completed',
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewDate: {
      type: Date,
    },
    isConfidential: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
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

clinicalReportSchema.methods.markAsReviewed = async function (
  reviewerId: mongoose.Types.ObjectId
): Promise<IClinicalReportDocument> {
  this.status = 'reviewed';
  this.reviewedBy = reviewerId;
  this.reviewDate = new Date();
  return this.save();
};

export const ClinicalReport = mongoose.model<IClinicalReportDocument, IClinicalReportModel>(
  'ClinicalReport',
  clinicalReportSchema
);
