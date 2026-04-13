/**
 * Mock for otplib v13
 * Provides new API compatible functions
 */

export const generate = (_secret: string): string => {
  // Mock implementation - returns a 6-digit code
  return '123456';
};

export const verify = ({
  token,
  secret: _secret,
}: {
  token: string;
  secret: string;
}): { success: boolean } => {
  // Mock implementation - accepts '123456' as valid
  return { success: token === '123456' };
};

export const generateURI = ({
  issuer,
  accountName,
  secret,
}: {
  issuer: string;
  accountName: string;
  secret: string;
}): string => {
  return `otpauth://totp/${issuer}:${accountName}?secret=${secret}&issuer=${issuer}`;
};

// For backwards compatibility with tests expecting 'totp'
export const totp = {
  keyuri: generateURI,
};

// For backwards compatibility with tests expecting 'authenticator'
export const authenticator = {
  generate,
  check: (token: string, secret: string) => verify({ token, secret }).success,
  keyuri: generateURI,
};

// Mock module default export
export default {
  generate,
  verify,
  generateURI,
};
