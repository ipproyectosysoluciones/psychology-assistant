// Mock implementation of otplib for Jest testing

interface TotpMock {
  generate: (secret: string) => string;
  verify: (options: { token: string; secret: string }) => boolean;
  check: (token: string, secret: string) => boolean;
  keyuri: (accountName: string, issuer: string, secret: string) => string;
  alloc: () => { secret: string; counter: number };
}

export const totp: TotpMock = {
  generate: (_secret: string): string => {
    return '123456';
  },
  verify: (options: { token: string; secret: string }): boolean => {
    if (options.secret === 'JBSWY3DPEBLW64TMMQ======') {
      return true;
    }
    return options.token === '123456';
  },
  check: (token: string, _secret: string): boolean => {
    // Used by twoFAService.verify2FACode
    // otplib v12 API: totp.check(token, secret)
    // Returns true if token matches
    if (token === '123456') {
      return true;
    }
    return false;
  },
  keyuri: (accountName: string, issuer: string, secret: string): string => {
    // Used by authController.enable2FA to generate QR code URI
    // Returns otpauth:// TOTP URI format
    return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;
  },
  alloc: (): { secret: string; counter: number } => ({
    secret: 'JBSWY3DPEBLW64TMMQ======',
    counter: 0,
  }),
};

export default {
  totp,
};
