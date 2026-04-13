import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Clinic status types
 */
export type ClinicStatus = 'active' | 'inactive' | 'suspended';

/**
 * Currency types
 */
export type Currency = 'COP' | 'USD' | 'ARS' | 'MXN' | 'CLP' | 'PEN';

/**
 * Clinic settings interface
 */
export interface IClinicSettings {
  appointmentDuration: number;
  cancellationPolicy: string;
  timezone: string;
}

/**
 * Clinic interface
 */
export interface IClinic {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  country: string;
  currency: Currency;
  owner: mongoose.Types.ObjectId;
  admins: mongoose.Types.ObjectId[];
  status: ClinicStatus;
  isVerified: boolean;
  logo?: string;
  settings: IClinicSettings;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Clinic document interface
 */
export interface IClinicDocument extends IClinic, Document {
  _id: mongoose.Types.ObjectId;
  isAdmin(userId: mongoose.Types.ObjectId): boolean;
  addAdmin(userId: mongoose.Types.ObjectId): Promise<this>;
  removeAdmin(userId: mongoose.Types.ObjectId): Promise<this>;
}

/**
 * Clinic model type
 */
export type IClinicModel = Model<IClinicDocument>;

const clinicSchema = new Schema<IClinicDocument>(
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
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    admins: {
      type: [Schema.Types.ObjectId],
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
  }
);

clinicSchema.index({ owner: 1 });
clinicSchema.index({ status: 1 });

clinicSchema.methods.isAdmin = function (userId: mongoose.Types.ObjectId): boolean {
  return (
    this.owner.equals(userId) ||
    this.admins.some((admin: mongoose.Types.ObjectId) => admin.equals(userId))
  );
};

clinicSchema.methods.addAdmin = async function (
  userId: mongoose.Types.ObjectId
): Promise<IClinicDocument> {
  if (!this.admins.includes(userId) && !this.owner.equals(userId)) {
    this.admins.push(userId);
  }
  return this.save();
};

clinicSchema.methods.removeAdmin = async function (
  userId: mongoose.Types.ObjectId
): Promise<IClinicDocument> {
  this.admins = this.admins.filter((admin: mongoose.Types.ObjectId) => !admin.equals(userId));
  return this.save();
};

export const Clinic = mongoose.model<IClinicDocument, IClinicModel>('Clinic', clinicSchema);
