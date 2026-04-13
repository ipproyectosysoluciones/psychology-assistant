import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Refresh token interface
 */
export interface IRefreshToken {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isRevoked: boolean;
  revokedAt?: Date;
  revokedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Refresh token document interface
 */
export interface IRefreshTokenDocument extends IRefreshToken, Document {
  _id: mongoose.Types.ObjectId;
  isExpired(): boolean;
  isValid(): boolean;
  revoke(reason?: string): Promise<this>;
}

/**
 * Refresh token model type
 */
export type IRefreshTokenModel = Model<IRefreshTokenDocument>;

const refreshTokenSchema = new Schema<IRefreshTokenDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    token: {
      type: String,
      required: [true, 'Token is required'],
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
      expires: 2592000, // TTL: 30 días en segundos
    },
    ipAddress: String,
    userAgent: String,
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    revokedAt: Date,
    revokedReason: String,
  },
  { timestamps: true }
);

refreshTokenSchema.methods.isExpired = function (): boolean {
  return new Date() > this.expiresAt;
};

refreshTokenSchema.methods.isValid = function (): boolean {
  return !this.isRevoked && !this.isExpired();
};

refreshTokenSchema.methods.revoke = async function (
  reason: string = 'Logout'
): Promise<IRefreshTokenDocument> {
  this.isRevoked = true;
  this.revokedAt = new Date();
  this.revokedReason = reason;
  return this.save();
};

export const RefreshToken = mongoose.model<IRefreshTokenDocument, IRefreshTokenModel>(
  'RefreshToken',
  refreshTokenSchema
);
