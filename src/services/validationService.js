/**
 * @module validationService
 * @description Servicio centralizado para validaciones avanzadas del negocio.
 * ES: Validaciones complejas más allá de express-validator.
 * EN: Complex business validations beyond express-validator.
 */

/**
 * Valida que la fecha de una cita sea válida según reglas del negocio
 * @param {Date} date - Fecha de la cita
 * @returns {object} { valid: boolean, error: string }
 */
export const validateAppointmentDate = (date) => {
  const appointmentDate = new Date(date);
  const now = new Date();

  // Debe ser en el futuro
  if (appointmentDate <= now) {
    return { valid: false, error: 'Appointment date must be in the future' };
  }

  // No más de 6 meses en el futuro
  const sixMonthsAhead = new Date();
  sixMonthsAhead.setMonth(sixMonthsAhead.getMonth() + 6);
  if (appointmentDate > sixMonthsAhead) {
    return {
      valid: false,
      error: 'Appointment date cannot be more than 6 months in advance'
    };
  }

  // No en fines de semana (opcional según las reglas del negocio)
  const dayOfWeek = appointmentDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      valid: false,
      error: 'Appointments cannot be scheduled on weekends'
    };
  }

  // Horario laboral: 8am - 6pm
  const hours = appointmentDate.getHours();
  if (hours < 8 || hours >= 18) {
    return {
      valid: false,
      error: 'Appointments must be between 8:00 AM and 6:00 PM'
    };
  }

  return { valid: true };
};

/**
 * Valida la fortaleza de una contraseña
 * @param {string} password - Contraseña a validar
 * @returns {object} { valid: boolean, error: string, score: number }
 */
export const validatePasswordStrength = (password) => {
  let score = 0;
  const errors = [];

  // Longitud mínima
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  // Longitud ideal
  if (password.length >= 12) {
    score += 1;
  }

  // Contiene minúsculas
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    errors.push('Password must contain lowercase letters');
  }

  // Contiene mayúsculas
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    errors.push('Password must contain uppercase letters');
  }

  // Contiene números
  if (/\d/.test(password)) {
    score += 1;
  } else {
    errors.push('Password must contain numbers');
  }

  // Contiene caracteres especiales
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 2;
  }

  // No contiene patrones comunes
  const commonPatterns = ['123456', 'password', 'qwerty', 'abc123'];
  if (
    commonPatterns.some((pattern) => password.toLowerCase().includes(pattern))
  ) {
    score -= 2;
    errors.push('Password contains common patterns');
  }

  return {
    valid: score >= 4 && errors.length === 0,
    error: errors.join(', '),
    score: Math.max(0, score),
    strength: score >= 6 ? 'strong' : score >= 4 ? 'medium' : 'weak'
  };
};

/**
 * Valida formato de email y dominios permitidos
 * @param {string} email - Email a validar
 * @param {array} allowedDomains - Dominios permitidos (opcional)
 * @returns {object} { valid: boolean, error: string }
 */
export const validateEmail = (email, allowedDomains = []) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Lista negra de dominios temporales conocidos
  const blockedDomains = [
    'tempmail.com',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com'
  ];

  const domain = email.split('@')[1].toLowerCase();

  if (blockedDomains.includes(domain)) {
    return { valid: false, error: 'Temporary email addresses are not allowed' };
  }

  // Si se especifican dominios permitidos, validar
  if (allowedDomains.length > 0 && !allowedDomains.includes(domain)) {
    return {
      valid: false,
      error: `Only emails from ${allowedDomains.join(', ')} are allowed`
    };
  }

  return { valid: true };
};

/**
 * Valida que no haya conflictos de citas para un usuario
 * @param {string} userId - ID del usuario
 * @param {Date} date - Fecha de la cita
 * @param {object} Appointment - Modelo de Appointment
 * @param {string} excludeId - ID de cita a excluir (para updates)
 * @returns {Promise<object>} { valid: boolean, error: string }
 */
export const validateAppointmentConflict = async (
  userId,
  date,
  Appointment,
  excludeId = null
) => {
  const appointmentDate = new Date(date);

  // Buscar citas en un rango de +/- 30 minutos
  const rangeStart = new Date(appointmentDate.getTime() - 30 * 60000);
  const rangeEnd = new Date(appointmentDate.getTime() + 30 * 60000);

  const query = {
    user: userId,
    date: { $gte: rangeStart, $lte: rangeEnd },
    status: { $nin: ['cancelled', 'completed'] }
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const conflictingAppointment = await Appointment.findOne(query);

  if (conflictingAppointment) {
    return {
      valid: false,
      error:
        'You already have an appointment scheduled within 30 minutes of this time'
    };
  }

  return { valid: true };
};

/**
 * Valida límites de tasa para acciones específicas
 * @param {string} userId - ID del usuario
 * @param {string} action - Tipo de acción
 * @param {number} maxAttempts - Máximo de intentos permitidos
 * @param {number} windowMs - Ventana de tiempo en ms
 * @param {object} cache - Sistema de cache (Redis/Memory)
 * @returns {Promise<object>} { valid: boolean, error: string, remainingAttempts: number }
 */
export const validateRateLimit = async (
  userId,
  action,
  maxAttempts,
  windowMs,
  cache
) => {
  const key = `ratelimit:${userId}:${action}`;
  const now = Date.now();

  // Obtener intentos previos
  let attempts = (await cache.get(key)) || [];

  // Filtrar intentos fuera de la ventana de tiempo
  attempts = attempts.filter((timestamp) => now - timestamp < windowMs);

  if (attempts.length >= maxAttempts) {
    const oldestAttempt = Math.min(...attempts);
    const timeUntilReset = Math.ceil((oldestAttempt + windowMs - now) / 1000);

    return {
      valid: false,
      error: `Too many attempts. Please try again in ${timeUntilReset} seconds`,
      remainingAttempts: 0
    };
  }

  // Agregar nuevo intento
  attempts.push(now);
  await cache.set(key, attempts, windowMs);

  return {
    valid: true,
    remainingAttempts: maxAttempts - attempts.length
  };
};

export default {
  validateAppointmentDate,
  validatePasswordStrength,
  validateEmail,
  validateAppointmentConflict,
  validateRateLimit
};
