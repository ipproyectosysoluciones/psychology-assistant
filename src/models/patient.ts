import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Patient status types
 */
export type PatientStatus = 'active' | 'inactive' | 'paused';

/**
 * Gender types
 */
export type Gender = 'M' | 'F' | 'Other' | 'Prefer not to say';

/**
 * ID document types
 */
export type IdType = 'CC' | 'TI' | 'CE' | 'PA' | 'RC';

/**
 * Employment status types
 */
export type EmploymentStatus = 'employed' | 'self-employed' | 'student' | 'unemployed' | 'retired';

/**
 * Emergency contact interface
 */
export interface IEmergencyContact {
  name?: string;
  relationship?: string;
  phone?: string;
}

/**
 * Patient interface
 */
export interface IPatient {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  clinic: mongoose.Types.ObjectId;
  dateOfBirth: Date;
  gender: Gender;
  idType: IdType;
  idNumber: string;
  address: string;
  phone: string;
  insurance?: string;
  insurancePlan?: string;
  employmentStatus: EmploymentStatus;
  emergencyContact: IEmergencyContact;
  medicalHistory?: string;
  allergies: string[];
  medications: string[];
  status: PatientStatus;
  preferredTherapist?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Patient document interface
 */
export interface IPatientDocument extends IPatient, Document {
  _id: mongoose.Types.ObjectId;
  getAge(): number;
  canScheduleAppointment(): boolean;
}

/**
 * Patient model type
 */
export type IPatientModel = Model<IPatientDocument>;

const patientSchema = new Schema<IPatientDocument>(
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
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['M', 'F', 'Other', 'Prefer not to say'],
      required: true,
    },
    idType: {
      type: String,
      enum: ['CC', 'TI', 'CE', 'PA', 'RC'],
      required: true,
    },
    idNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    insurance: {
      type: String,
      trim: true,
    },
    insurancePlan: {
      type: String,
      trim: true,
    },
    employmentStatus: {
      type: String,
      enum: ['employed', 'self-employed', 'student', 'unemployed', 'retired'],
      default: 'employed',
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    medicalHistory: {
      type: String,
      maxlength: 2000,
    },
    allergies: {
      type: [String],
      default: [],
    },
    medications: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'paused'],
      default: 'active',
    },
    preferredTherapist: {
      type: Schema.Types.ObjectId,
      ref: 'Therapist',
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

patientSchema.index({ clinic: 1 });
patientSchema.index({ user: 1 });
patientSchema.index({ status: 1 });
patientSchema.index({ idNumber: 1 });

patientSchema.methods.getAge = function () {
  const today = new Date();
  let age = today.getFullYear() - this.dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - this.dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.dateOfBirth.getDate())) {
    age--;
  }
  return age;
};

patientSchema.methods.canScheduleAppointment = function () {
  return this.status === 'active';
};

export const Patient = mongoose.model<IPatientDocument, IPatientModel>('Patient', patientSchema);
