import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Therapist status types
 */
export type TherapistStatus = 'active' | 'inactive' | 'on_leave';

/**
 * Availability time slot interface
 */
export interface ITimeSlot {
  start: string;
  end: string;
}

/**
 * Availability interface
 */
export interface IAvailability {
  monday: ITimeSlot[];
  tuesday: ITimeSlot[];
  wednesday: ITimeSlot[];
  thursday: ITimeSlot[];
  friday: ITimeSlot[];
  saturday: ITimeSlot[];
  sunday: ITimeSlot[];
}

/**
 * Therapist interface
 */
export interface ITherapist {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  clinic: mongoose.Types.ObjectId;
  specializations: string[];
  licenseNumber: string;
  licenseExpiry: Date;
  bio?: string;
  qualifications: string[];
  hourlyRate: number;
  availability: IAvailability;
  status: TherapistStatus;
  isVerified: boolean;
  languages: string[];
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Therapist document interface
 */
export interface ITherapistDocument extends ITherapist, Document {
  _id: mongoose.Types.ObjectId;
  isLicenseValid(): boolean;
  canTakeAppointments(): boolean;
}

/**
 * Therapist model type
 */
export type ITherapistModel = Model<ITherapistDocument>;

const therapistSchema = new Schema<ITherapistDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    clinic: {
      type: Schema.Types.ObjectId,
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
  }
);

therapistSchema.index({ clinic: 1 });
therapistSchema.index({ user: 1 });
therapistSchema.index({ status: 1 });

therapistSchema.methods.isLicenseValid = function () {
  return new Date() < this.licenseExpiry;
};

therapistSchema.methods.canTakeAppointments = function () {
  return this.status === 'active' && this.isLicenseValid();
};

export const Therapist = mongoose.model<ITherapistDocument, ITherapistModel>(
  'Therapist',
  therapistSchema
);
