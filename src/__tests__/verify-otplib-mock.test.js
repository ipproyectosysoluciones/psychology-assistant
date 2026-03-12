describe('Verify otplib mock with unstable_mockModule', () => {
  it.skip('should have totp.check mocked to return true', async () => {
    // Use unstable_mockModule for ESM
    jest.unstable_mockModule('otplib', () => ({
      totp: {
        generate: jest.fn(() => '123456'),
        check: jest.fn(() => true), // Return true for tests
        keyuri: jest.fn(
          (email, appName, secret) =>
            `otpauth://totp/${appName}:${email}?secret=${secret}&issuer=${appName}`
        )
      }
    }));

    // Dynamic import AFTER mock is registered
    const { totp } = await import('otplib');

    const result = totp.check('anytoken', 'anysecret');
    expect(result).toBe(true);
  });
});
