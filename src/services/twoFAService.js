import crypto from 'crypto';
import { totp } from 'otplib';

/**
 * @module generateSecret
 * @description Genera un nuevo secreto TOTP base32 válido.
 *
 * @returns { string } - El nuevo secreto TOTP generado.
 */
export const generateSecret = () => {
  // Generate 32 random bytes
  const randomBytes = crypto.randomBytes(32);

  // Convert to base32 (A-Z, 2-7)
  const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let base32 = '';
  let bits = 0;
  let value = 0;

  for (let i = 0; i < randomBytes.length; i++) {
    value = (value << 8) | randomBytes[i];
    bits += 8;

    while (bits >= 5) {
      bits -= 5;
      base32 += base32chars[(value >> bits) & 31];
    }
  }

  if (bits > 0) {
    base32 += base32chars[(value << (5 - bits)) & 31];
  }

  return base32;
};

/**
 * @module generate2FACode
 * @description Genera una contraseña de un solo uso basada en tiempo (TOTP) utilizando el `secret` proporcionado.
 *
 * @param { string } secret - la clave secreta utilizada para generar la TOTP.
 * @returns { string } -  El código TOTP generado.
 */
export const generate2FACode = (secret) => {
  return totp.generate(secret);
};

/**
 * @module verify2FACode
 * @description Verifica el token 2FA proporcionado con el secreto mediante el algoritmo TOTP.
 *
 * @param { string } token -  el token 2FA que se verificará.
 * @param { string } secret -  la clave secreta utilizada para generar el token.
 * @returns { boolean } - verdadero si el token es válido, falso en caso contrario.
 */
export const verify2FACode = (token, secret) => {
  return totp.check(token, secret);
};

export default {
  generateSecret,
  generate2FACode,
  verify2FACode
};
