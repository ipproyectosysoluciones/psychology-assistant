import { Types, Document } from 'mongoose';

/**
 * @module validationService
 * @description Centralized service for advanced business validations.
 * ES: Validaciones complejas más allá de express-validator.
 * EN: Complex business validations beyond express-validator.
 */

// Type for appointment validation result
interface ValidationResult {
  valid: boolean;
  error?: string;
}

// Type for password validation result
interface PasswordValidationResult extends ValidationResult {
  score: number;
  strength?: 'strong' | 'medium' | 'weak';
}

// Type for rate limit validation result
interface RateLimitResult extends ValidationResult {
  remainingAttempts: number;
}

// Cache interface
interface RateLimitCache {
  get(key: string): Promise<number[]>;
  set(key: string, attempts: number[], windowMs: number): Promise<void>;
}

// Appointment document type
type AppointmentDocument = Document & {
  _id: Types.ObjectId;
};

/**
 * Validates that an appointment date is valid according to business rules
 * @param {Date|string} date - Appointment date
 * @returns {object} { valid: boolean, error: string }
 */
export const validateAppointmentDate = (date: Date | string): ValidationResult => {
  const appointmentDate = new Date(date);
  const now = new Date();

  // Must be in the future
  if (appointmentDate <= now) {
    return { valid: false, error: 'Appointment date must be in the future' };
  }

  // No more than 6 months in the future
  const sixMonthsAhead = new Date();
  sixMonthsAhead.setMonth(sixMonthsAhead.getMonth() + 6);
  if (appointmentDate > sixMonthsAhead) {
    return {
      valid: false,
      error: 'Appointment date cannot be more than 6 months in advance',
    };
  }

  // No weekends (optional based on business rules)
  const dayOfWeek = appointmentDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      valid: false,
      error: 'Appointments cannot be scheduled on weekends',
    };
  }

  // Business hours: 8am - 6pm
  const hours = appointmentDate.getHours();
  if (hours < 8 || hours >= 18) {
    return {
      valid: false,
      error: 'Appointments must be between 8:00 AM and 6:00 PM',
    };
  }

  return { valid: true };
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} { valid: boolean, error: string, score: number }
 */
export const validatePasswordStrength = (password: string): PasswordValidationResult => {
  let score = 0;
  const errors: string[] = [];

  // Minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  // Ideal length
  if (password.length >= 12) {
    score += 1;
  }

  // Contains lowercase
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    errors.push('Password must contain lowercase letters');
  }

  // Contains uppercase
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    errors.push('Password must contain uppercase letters');
  }

  // Contains numbers
  if (/\d/.test(password)) {
    score += 1;
  } else {
    errors.push('Password must contain numbers');
  }

  // Contains special characters
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    score += 2;
  }

  // Common patterns check
  const commonPatterns = ['123456', 'password', 'qwerty', 'abc123'];
  if (commonPatterns.some((pattern) => password.toLowerCase().includes(pattern))) {
    score -= 2;
    errors.push('Password contains common patterns');
  }

  return {
    valid: score >= 4 && errors.length === 0,
    error: errors.join(', '),
    score: Math.max(0, score),
    strength: score >= 6 ? 'strong' : score >= 4 ? 'medium' : 'weak',
  };
};

/**
 * Validates email format and allowed domains
 * @param {string} email - Email to validate
 * @param {string[]} allowedDomains - Allowed domains (optional)
 * @returns {object} { valid: boolean, error: string }
 */
export const validateEmail = (email: string, allowedDomains: string[] = []): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Blacklist of known temporary email domains
  const blockedDomains = [
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
  ];

  const domain = email.split('@')[1]?.toLowerCase() || '';

  if (blockedDomains.includes(domain)) {
    return { valid: false, error: 'Temporary email addresses are not allowed' };
  }

  // If allowed domains are specified, validate
  if (allowedDomains.length > 0 && !allowedDomains.includes(domain)) {
    return {
      valid: false,
      error: `Only emails from ${allowedDomains.join(', ')} are allowed`,
    };
  }

  return { valid: true };
};

/**
 * Validates no appointment conflicts for a user
 * @param {string} userId - User ID
 * @param {Date|string} date - Appointment date
 * @param {object} Appointment - Appointment model
 * @param {string|null} excludeId - Appointment ID to exclude (for updates)
 * @returns {Promise<object>} { valid: boolean, error: string }
 */
export const validateAppointmentConflict = async (
  userId: string | Types.ObjectId,
  date: Date | string,
  Appointment: {
    findOne(query: Record<string, unknown>): Promise<AppointmentDocument | null>;
  },
  excludeId: string | null = null
): Promise<ValidationResult> => {
  const appointmentDate = new Date(date);

  // Search for appointments in a +/- 30 minute range
  const rangeStart = new Date(appointmentDate.getTime() - 30 * 60000);
  const rangeEnd = new Date(appointmentDate.getTime() + 30 * 60000);

  const query: Record<string, unknown> = {
    user: userId,
    date: { $gte: rangeStart, $lte: rangeEnd },
    status: { $nin: ['cancelled', 'completed'] },
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const conflictingAppointment = await Appointment.findOne(query);

  if (conflictingAppointment) {
    return {
      valid: false,
      error: 'You already have an appointment scheduled within 30 minutes of this time',
    };
  }

  return { valid: true };
};

/**
 * Validates rate limits for specific actions
 * @param {string} userId - User ID
 * @param {string} action - Action type
 * @param {number} maxAttempts - Maximum allowed attempts
 * @param {number} windowMs - Time window in ms
 * @param {object} cache - Cache system (Redis/Memory)
 * @returns {Promise<object>} { valid: boolean, error: string, remainingAttempts: number }
 */
export const validateRateLimit = async (
  userId: string,
  action: string,
  maxAttempts: number,
  windowMs: number,
  cache: RateLimitCache
): Promise<RateLimitResult> => {
  const key = `ratelimit:${userId}:${action}`;
  const now = Date.now();

  // Get previous attempts
  let attempts = (await cache.get(key)) || [];

  // Filter out attempts outside the time window
  attempts = attempts.filter((timestamp) => now - timestamp < windowMs);

  if (attempts.length >= maxAttempts) {
    const oldestAttempt = Math.min(...attempts);
    const timeUntilReset = Math.ceil((oldestAttempt + windowMs - now) / 1000);

    return {
      valid: false,
      error: `Too many attempts. Please try again in ${timeUntilReset} seconds`,
      remainingAttempts: 0,
    };
  }

  // Add new attempt
  attempts.push(now);
  await cache.set(key, attempts, windowMs);

  return {
    valid: true,
    remainingAttempts: maxAttempts - attempts.length,
  };
};

export const validationService = {
  validateAppointmentDate,
  validatePasswordStrength,
  validateEmail,
  validateAppointmentConflict,
  validateRateLimit,
};

export default validationService;
