import { Schema, model } from 'mongoose';

/**
 * @schema RefreshToken
 * @description Almacena tokens de refresco JWT para mantener sesiones activas.
 * ES: Modelo para gestionar refresh tokens y renovación de sesiones.
 * EN: Model for managing refresh tokens and session renewal.
 */
const refreshTokenSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true
    },
    token: {
      type: String,
      required: [true, 'Token is required'],
      unique: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
      expires: 2592000 // TTL: 30 días en segundos - MongoDB eliminará automáticamente después de expiresAt
    },
    ipAddress: String,
    userAgent: String,
    isRevoked: {
      type: Boolean,
      default: false,
      index: true
    },
    revokedAt: Date,
    revokedReason: String
  },
  { timestamps: true }
);

/**
 * @method isExpired
 * @description Verifica si el token ha expirado.
 * ES: Comprueba si la fecha de expiración ha pasado.
 * EN: Checks if expiration date has passed.
 */
refreshTokenSchema.methods.isExpired = function () {
  return new Date() > this.expiresAt;
};

/**
 * @method isValid
 * @description Verifica si el token es válido (no expirado ni revocado).
 * ES: Comprueba si el token puede ser utilizado.
 * EN: Checks if token can be used.
 */
refreshTokenSchema.methods.isValid = function () {
  return !this.isRevoked && !this.isExpired();
};

/**
 * @method revoke
 * @description Revoca el token de refresco.
 * ES: Invalida el token de manera explicit.
 * EN: Explicitly invalidates the token.
 */
refreshTokenSchema.methods.revoke = function (reason = 'Logout') {
  this.isRevoked = true;
  this.revokedAt = new Date();
  this.revokedReason = reason;
  return this.save();
};

export const RefreshToken = model('RefreshToken', refreshTokenSchema);
