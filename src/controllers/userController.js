import logger from '../config/logger.js';
import User from '../models/user.js';
import { ApiResponse, sendResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/appError.js';

/**
 * @module getUserProfile
 * @description Obtiene el perfil del usuario autenticado.
 * ES: Devuelve información del usuario sin contraseña.
 * EN: Returns user information without password.
 */
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password -twoFASecret')
    .populate('appointments', 'date description status');

  if (!user) {
    throw new Error('User not found');
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
        createdAt: user.createdAt,
        appointmentsCount: user.appointments?.length || 0,
      },
    },
    'Profile retrieved successfully',
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
    throw new Error('At least one field (name or email) must be provided');
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new Error('User not found');
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      throw new Error('Email already in use');
    }
    user.email = email.toLowerCase().trim();
  }

  if (name) {
    user.name = name.trim();
  }

  await user.save();

  logger.info('User profile updated', {
    userId: req.user._id,
    updates: { name, email },
  });

  const response = ApiResponse.success(
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        twoFAEnabled: user.twoFAEnabled,
        updatedAt: user.updatedAt,
      },
    },
    'Profile updated successfully',
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
    throw new Error('Current password and new password are required');
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    throw new Error('User not found');
  }

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  // Update password (will be hashed by pre-save hook)
  user.password = newPassword;
  await user.save();

  logger.info('Password changed successfully', { userId: req.user._id });

  const response = ApiResponse.success(
    { passwordChanged: true },
    'Password changed successfully',
  );

  sendResponse(res, response);
});

/**
 * @module deactivateAccount
 * @description Desactiva la cuenta del usuario.
 * ES: Marca la cuenta como inactiva (soft delete).
 * EN: Marks account as inactive (soft delete).
 */
export const deactivateAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new Error('User not found');
  }

  user.isActive = false;
  await user.save();

  logger.info('Account deactivated', { userId: req.user._id });

  const response = ApiResponse.success(
    { accountDeactivated: true },
    'Account deactivated successfully',
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
    throw new Error('User not found');
  }

  // Get appointment statistics
  const totalAppointments = await user
    .model('Appointment')
    .countDocuments({ user: req.user._id });
  const upcomingAppointments = await user.model('Appointment').countDocuments({
    user: req.user._id,
    date: { $gte: new Date() },
    status: { $in: ['scheduled', 'confirmed'] },
  });
  const completedAppointments = await user.model('Appointment').countDocuments({
    user: req.user._id,
    status: 'completed',
  });

  // Get session statistics
  const totalSessions = await user
    .model('Session')
    .countDocuments({ user: req.user._id });
  const activeSessions = await user.model('Session').countDocuments({
    user: req.user._id,
    isActive: true,
  });

  const stats = {
    appointments: {
      total: totalAppointments,
      upcoming: upcomingAppointments,
      completed: completedAppointments,
      completionRate:
        totalAppointments > 0
          ? ((completedAppointments / totalAppointments) * 100).toFixed(1)
          : 0,
    },
    sessions: {
      total: totalSessions,
      active: activeSessions,
    },
    account: {
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      twoFAEnabled: user.twoFAEnabled,
      role: user.role,
    },
  };

  logger.info('User stats retrieved', { userId: req.user._id });

  const response = ApiResponse.success(
    { stats },
    'User statistics retrieved successfully',
  );

  sendResponse(res, response);
});
