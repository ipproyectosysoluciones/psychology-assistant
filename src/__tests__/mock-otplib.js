// Mock implementation of otplib for Jest testing

export const totp = {
  generate: (secret) => {
    return '123456';
  },
  verify: (options) => {
    if (options.secret === 'JBSWY3DPEBLW64TMMQ======') {
      return true;
    }
    return options.token === '123456';
  },
  alloc: () => ({
    secret: 'JBSWY3DPEBLW64TMMQ======',
    counter: 0,
  }),
};

export default {
  totp,
};
