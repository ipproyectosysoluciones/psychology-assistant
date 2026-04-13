describe('Verify otplib mock with unstable_mockModule', () => {
  it.skip('should have totp.check mocked to return true', async () => {
    // Use unstable_mockModule for ESM
    // @ts-expect-error — jest.unstable_mockModule exists at runtime but @types/jest@30 lacks the type
    jest.unstable_mockModule('otplib', () => ({
      totp: {
        generate: jest.fn(() => '123456'),
        check: jest.fn(() => true), // Return true for tests
        keyuri: jest.fn(
          (email: string, appName: string, secret: string) =>
            `otpauth://totp/${appName}:${email}?secret=${secret}&issuer=${appName}`
        ),
      },
    }));

    // Dynamic import AFTER mock is registered
    // @ts-expect-error — otplib types don't expose totp as named export; mock provides it
    const { totp } = await import('otplib');

    const result = (totp as unknown as { check: (token: string, secret: string) => boolean }).check(
      'anytoken',
      'anysecret'
    );
    expect(result).toBe(true);
  });
});
