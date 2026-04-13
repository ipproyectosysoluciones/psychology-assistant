import crypto from 'crypto';
import { generate, verify } from 'otplib';

/**
 * @module generateSecret
 * @description Generates a valid base32 TOTP secret.
 *
 * @returns { string } - The generated TOTP secret.
 */
export const generateSecret = (): string => {
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
 * @description Generates a time-based one-time password (TOTP) using the provided secret.
 *
 * @param { string } secret - The secret key used to generate the TOTP.
 * @returns { Promise<string> } - The generated TOTP code.
 */
export const generate2FACode = async (secret: string): Promise<string> => {
  return generate({ secret });
};

/**
 * @module verify2FACode
 * @description Verifies the provided 2FA token with the secret using TOTP algorithm.
 *
 * @param { string } token - The 2FA token to verify.
 * @param { string } secret - The secret key used to generate the token.
 * @returns { Promise<boolean> } - True if the token is valid, false otherwise.
 */
export const verify2FACode = async (token: string, secret: string): Promise<boolean> => {
  const result = await verify({ token, secret });
  return Boolean(result);
};

export const twoFAService = {
  generateSecret,
  generate2FACode,
  verify2FACode,
};

export default twoFAService;
