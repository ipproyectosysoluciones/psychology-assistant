import crypto from 'crypto';
import { totp } from 'otplib';

/**
 * @module generateSecret
 * @description Genera un nuevo secreto TOTP.
 *
 * @returns { string } - El nuevo secreto TOTP generado.
 */
export const generateSecret = () => {
  // Generate random bytes and convert to a base32-compatible string
  const randomBytes = crypto.randomBytes(32);
  const secret = randomBytes
    .toString('base64')
    .replace(/\//g, '+')
    .replace(/\+/g, '-')
    .substring(0, 32);
  return secret;
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
