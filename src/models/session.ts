import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Session interface
 */
export interface ISession {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  appointment?: mongoose.Types.ObjectId;
  loginTime: Date;
  logoutTime?: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  duration?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Session document interface
 */
export interface ISessionDocument extends ISession, Document {
  _id: mongoose.Types.ObjectId;
  logout(): Promise<this>;
}

/**
 * Session model type
 */
export type ISessionModel = Model<ISessionDocument>;

const sessionSchema = new Schema<ISessionDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: false,
    },
    loginTime: {
      type: Date,
      default: Date.now,
    },
    logoutTime: Date,
    ipAddress: String,
    userAgent: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    duration: Number,
    notes: String,
  },
  { timestamps: true }
);

sessionSchema.index({ user: 1, loginTime: -1 });
sessionSchema.index({ isActive: 1 });
sessionSchema.index({ createdAt: -1 });

sessionSchema.methods.logout = async function (): Promise<ISessionDocument> {
  this.logoutTime = new Date();
  this.isActive = false;
  this.duration = Math.floor((this.logoutTime.getTime() - this.loginTime.getTime()) / 1000);
  return this.save();
};

export const Session = mongoose.model<ISessionDocument, ISessionModel>('Session', sessionSchema);
