import logger from '../config/logger.js';
import { AUDIT_EVENTS, auditLog } from '../middlewares/auditMiddleware.js';
import { Appointment } from '../models/appointment.js';
import RefreshToken from '../models/refreshToken.js';
import { User } from '../models/user.js';
import validationService from '../services/validationService.js';
import { ApiResponse, sendResponse } from '../utils/apiResponse.js';
import { AppError, asyncHandler } from '../utils/appError.js';

/**
 * @module getUserProfile
 * @description Obtiene el perfil del usuario autenticado.
 * ES: Devuelve información del usuario sin contraseña.
 * EN: Returns user information without password.
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    '-password -twoFASecret'
  );

  if (!user) {
    throw AppError.notFound('User not found');
  }

  logger.info('User profile retrieved', { userId: req.user._id });

  const response = ApiResponse.success(
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        twoFAEnabled: user.twoFAEnabled,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    },
    'Profile retrieved successfully'
  );

  sendResponse(res, response);
});

/**
 * @module updateUserProfile
 * @description Actualiza el perfil del usuario autenticado.
 * ES: Permite actualizar nombre y email con validaciones.
 * EN: Allows updating name and email with validations.
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // Validate input
  if (!name && !email) {
    throw AppError.badRequest(
      'At least one field (name or email) must be provided'
    );
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw AppError.notFound('User not found');
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      throw AppError.badRequest('Email already in use');
    }
    user.email = email.toLowerCase().trim();
  }

  if (name) {
    user.name = name.trim();
  }

  await user.save();

  logger.info('User profile updated', {
    userId: req.user._id,
    updates: { name, email }
  });

  const response = ApiResponse.success(
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        twoFAEnabled: user.twoFAEnabled,
        updatedAt: user.updatedAt
      }
    },
    'Profile updated successfully'
  );

  sendResponse(res, response);
});

/**
 * @module changePassword
 * @description Cambia la contraseña del usuario.
 * ES: Verifica contraseña actual y establece nueva con validaciones.
 * EN: Verifies current password and sets new one with validations.
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw AppError.badRequest('Current password and new password are required');
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    throw AppError.notFound('User not found');
  }

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    auditLog(
      user._id,
      AUDIT_EVENTS.PASSWORD_CHANGE,
      'User',
      { userId: user._id },
      'FAILURE',
      'Incorrect current password'
    );
    throw AppError.badRequest('Current password is incorrect');
  }

  // Validate new password strength
  const passwordValidation =
    validationService.validatePasswordStrength(newPassword);
  if (!passwordValidation.valid) {
    auditLog(
      user._id,
      AUDIT_EVENTS.PASSWORD_CHANGE,
      'User',
      { userId: user._id },
      'FAILURE',
      'Weak password'
    );
    throw AppError.badRequest(
      `New password is too weak: ${passwordValidation.error}`
    );
  }

  // Update password (will be hashed by pre-save hook)
  user.password = newPassword;
  await user.save();

  // Audit log successful password change
  auditLog(
    user._id,
    AUDIT_EVENTS.PASSWORD_CHANGE,
    'User',
    { userId: user._id },
    'SUCCESS'
  );

  logger.info('Password changed successfully', { userId: req.user._id });

  const response = ApiResponse.success(
    { passwordChanged: true },
    'Password changed successfully'
  );

  sendResponse(res, response);
});

/**
 * @module deactivateAccount
 * @description Desactiva la cuenta del usuario.
 * ES: Verifica contraseña y marca la cuenta como inactiva (soft delete).
 * EN: Verifies password and marks account as inactive (soft delete).
 */
export const deactivateAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw AppError.badRequest('Password is required to deactivate account');
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    throw AppError.notFound('User not found');
  }

  // Verify password before deactivation
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    auditLog(
      user._id,
      AUDIT_EVENTS.ACCOUNT_DEACTIVATION,
      'User',
      { userId: user._id },
      'FAILURE',
      'Incorrect password'
    );
    throw AppError.badRequest('Password is incorrect');
  }

  user.isActive = false;
  await user.save();

  // Audit log account deactivation
  auditLog(
    user._id,
    AUDIT_EVENTS.ACCOUNT_DEACTIVATION,
    'User',
    {
      userId: user._id,
      email: user.email
    },
    'SUCCESS'
  );

  logger.info('Account deactivated', { userId: req.user._id });

  const response = ApiResponse.success(
    { accountDeactivated: true },
    'Account deactivated successfully'
  );

  sendResponse(res, response);
});

/**
 * @module getUserStats
 * @description Obtiene estadísticas del usuario.
 * ES: Devuelve métricas de citas y actividad.
 * EN: Returns appointment metrics and activity stats.
 */
export const getUserStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw AppError.notFound('User not found');
  }

  // Get appointment statistics
  const totalAppointments = await user
    .model('Appointment')
    .countDocuments({ user: req.user._id });
  const upcomingAppointments = await user.model('Appointment').countDocuments({
    user: req.user._id,
    date: { $gte: new Date() },
    status: { $in: ['scheduled', 'confirmed'] }
  });
  const completedAppointments = await user.model('Appointment').countDocuments({
    user: req.user._id,
    status: 'completed'
  });

  // Get session statistics
  const totalSessions = await user
    .model('Session')
    .countDocuments({ user: req.user._id });
  const activeSessions = await user.model('Session').countDocuments({
    user: req.user._id,
    isActive: true
  });

  const stats = {
    appointments: {
      total: totalAppointments,
      upcoming: upcomingAppointments,
      completed: completedAppointments,
      completionRate:
        totalAppointments > 0
          ? ((completedAppointments / totalAppointments) * 100).toFixed(1)
          : 0
    },
    sessions: {
      total: totalSessions,
      active: activeSessions
    },
    account: {
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      twoFAEnabled: user.twoFAEnabled,
      role: user.role
    }
  };

  logger.info('User stats retrieved', { userId: req.user._id });

  const response = ApiResponse.success(
    { stats },
    'User statistics retrieved successfully'
  );

  sendResponse(res, response);
});

/**
 * @module deleteAllUserData
 * @description Elimina todos los datos del usuario (Cumplimiento GDPR).
 * ES: Borra citas, sesiones y tokens de refresco. Requiere confirmación de contraseña.
 * EN: Deletes all user data including appointments, sessions, and refresh tokens.
 */
export const deleteAllUserData = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw AppError.badRequest('Password is required to delete user data');
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    throw AppError.notFound('User not found');
  }

  // Verify password before deletion
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    auditLog(
      user._id,
      AUDIT_EVENTS.DATA_DELETION,
      'User',
      { userId: user._id },
      'FAILURE',
      'Incorrect password'
    );
    throw AppError.badRequest('Password is incorrect');
  }

  // Delete user appointments
  const appointmentCount = await Appointment.countDocuments({
    user: req.user._id
  });
  await Appointment.deleteMany({ user: req.user._id });

  // Delete user refresh tokens (active sessions)
  const tokenCount = await RefreshToken.countDocuments({
    user: req.user._id
  });
  await RefreshToken.deleteMany({ user: req.user._id });

  // Optionally: Mark user as deleted instead of permanently deleting
  // This preserves referential integrity and allows future recovery if needed
  user.isActive = false;
  user.email = `deleted.${Date.now()}@deleted.io`;
  user.name = 'Deleted User';
  await user.save();

  // Audit log data deletion (GDPR compliance)
  auditLog(
    user._id,
    'DATA_DELETION_GDPR',
    'User',
    {
      userId: user._id,
      appointmentsDeleted: appointmentCount,
      tokensRevoked: tokenCount,
      timestamp: new Date().toISOString()
    },
    'SUCCESS'
  );

  logger.info('User data deleted (GDPR)', {
    userId: req.user._id,
    appointmentsDeleted: appointmentCount,
    tokensRevoked: tokenCount
  });

  const response = ApiResponse.success(
    {
      dataDeleted: true,
      deletedItems: {
        appointments: appointmentCount,
        sessions: tokenCount
      },
      message:
        'All your personal data has been deleted in accordance with GDPR.'
    },
    'User data deleted successfully'
  );

  sendResponse(res, response);
});
