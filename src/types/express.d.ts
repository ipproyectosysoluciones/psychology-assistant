import { Document, Types } from 'mongoose';

/**
 * User role types
 */
export type UserRole = 'user' | 'psychologist' | 'admin';

/**
 * User interface for type checking
 */
export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  twoFAEnabled: boolean;
  twoFASecret?: string;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User document interface for Mongoose
 */
export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}

/**
 * Clinic interface
 */
export interface IClinic {
  _id: Types.ObjectId;
  name: string;
  address: string;
  phone: string;
  email?: string;
  owner: Types.ObjectId;
  psychologists: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Express Request with authenticated user
 */
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      clinic?: IClinic;
    }
  }
}

export {};
