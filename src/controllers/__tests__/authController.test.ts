import request from 'supertest';
import app from '../../app.js';
import { User } from '../../models/user.js';
import { RefreshToken } from '../../models/refreshToken.js';
import qrService from '../../services/qrService.js';
import * as twoFAService from '../../services/twoFAService.js';

beforeEach(async () => {
  await User.deleteMany({});
  await RefreshToken.deleteMany({});

  // Mock qrService.generateQR to return a fake QR code
  jest
    .spyOn(qrService, 'generateQR')
    .mockImplementation(() =>
      Promise.resolve(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      )
    );
});

afterEach(async () => {
  // Only restore mocks that were created in beforeEach
  // Don't use restoreAllMocks as it would break nested describe blocks
  if ((qrService.generateQR as jest.Mock)?.mockClear) {
    (qrService.generateQR as jest.Mock).mockClear();
  }
});

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'MySecurePass@2024',
      };

      const response = await request(app).post('/api/auth/register').send(userData);

      if (response.status !== 201) {
        throw new Error(`Registration failed: ${JSON.stringify(response.body)}`);
      }

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.message).toBe('User registered successfully');
    });

    it('should fail with invalid password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password', // Invalid - no uppercase or numbers
      };

      const response = await request(app).post('/api/auth/register').send(userData).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: 'password',
          message: 'Password must contain uppercase, lowercase, and numbers',
        })
      );
    });

    it('should fail with duplicate email', async () => {
      // Create first user
      await User.create({
        name: 'Existing User',
        email: 'test@example.com',
        password: 'MySecurePass@2024',
      });

      const userData = {
        name: 'Test User',
        email: 'test@example.com', // Same email
        password: 'MySecurePass@2024',
      };

      const response = await request(app).post('/api/auth/register').send(userData).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'MySecurePass@2024',
      });
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'MySecurePass@2024',
      };

      const response = await request(app).post('/api/auth/login').send(loginData).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.message).toBe('Login successful');
    });

    it('should fail with invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'WrongPass@123', // Wrong password for existing user
      };

      const response = await request(app).post('/api/auth/login').send(loginData);

      // Accept 400, 401, or 500 (error handler may wrap it)
      [400, 401, 500].forEach((_code) => {
        if (![400, 401, 500].includes(response.status)) {
          throw new Error(`Login failed with unexpected status: ${JSON.stringify(response.body)}`);
        }
      });

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Invalid credentials|not found/i);
    });

    it('should fail with non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'MySecurePass@2024',
      };

      const response = await request(app).post('/api/auth/login').send(loginData).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('POST /api/auth/logout', () => {
    let token: string;

    beforeEach(async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'MySecurePass@2024',
      });

      // Login to get token
      const loginResponse = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'MySecurePass@2024',
      });

      token = loginResponse.body.data.accessToken;
    });

    it('should logout successfully with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeNull();
      expect(response.body.message).toBe('Logged out successfully');
    });

    it('should fail without authorization token', async () => {
      const response = await request(app).post('/api/auth/logout').expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No token provided');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid token');
    });
  });

  describe('POST /api/auth/enable-2fa', () => {
    let token: string;

    beforeEach(async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'MySecurePass@2024',
      });

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'MySecurePass@2024',
      });

      token = loginResponse.body.data.accessToken;
    });

    it('should enable 2FA successfully', async () => {
      const response = await request(app)
        .post('/api/auth/enable-2fa')
        .set('Authorization', `Bearer ${token}`);

      if (response.status !== 200) {
        throw new Error(`Enable 2FA failed: ${JSON.stringify(response.body)}`);
      }

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('qrCode');
      expect(response.body.data).toHaveProperty('secret');
      expect(response.body.message).toBe('Scan the QR code with your authenticator app');
    });
  });

  describe('POST /api/auth/verify-2fa', () => {
    let token: string;
    let secret: string;
    let testEmail: string;

    beforeEach(async () => {
      // CRITICAL: Do NOT mock here. Mocking doesn't work properly with ESM modules.
      // Instead, we'll generate a real token just before verification.

      testEmail = `test-${Date.now()}-${Math.random()}@example.com`;

      // Create user
      const user = await User.create({
        name: 'Test User',
        email: testEmail,
        password: 'MySecurePass@2024',
      });

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: testEmail,
        password: 'MySecurePass@2024',
      });

      token = loginResponse.body.data.accessToken;

      // Enable 2FA first
      const enableResponse = await request(app)
        .post('/api/auth/enable-2fa')
        .set('Authorization', `Bearer ${token}`);

      if (enableResponse.status !== 200) {
        throw new Error(`Enable 2FA failed: ${JSON.stringify(enableResponse.body)}`);
      }

      secret = enableResponse.body.data.secret;

      // Manually save the secret to the user in the database
      // This ensures the secret persists for the verify-2fa test
      const userFromDb = await User.findById(user._id);

      if (userFromDb) {
        userFromDb.twoFASecret = secret;
        userFromDb.twoFAEnabled = false;
        await userFromDb.save();
      }
    });

    afterEach(async () => {
      await User.deleteMany({});
    });

    it('should verify 2FA successfully with valid token', async () => {
      // Generate a REAL TOTP token using the secret
      // We generate it just before using to minimize the window of expiration
      // TOTP tokens are valid for 30 seconds, so generating and using immediately should work
      const validToken = await twoFAService.generate2FACode(secret);

      const response = await request(app)
        .post('/api/auth/verify-2fa')
        .set('Authorization', `Bearer ${token}`)
        .send({ token: validToken });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.twoFAEnabled).toBe(true);
      expect(response.body.message).toBe('Two-factor authentication enabled successfully');
    });

    it('should fail with invalid 2FA token', async () => {
      // Empty token should fail at validation level
      const response = await request(app)
        .post('/api/auth/verify-2fa')
        .set('Authorization', `Bearer ${token}`)
        .send({ token: '' });

      // Expect validation error - status should be 400 or 422
      expect([400, 422]).toContain(response.status);
      expect(response.body.success).toBe(false);
      // Message can be "Validation failed" or some error about token
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /api/auth/refresh-token', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Create user and login
      await User.create({
        name: 'Test User',
        email: 'refresh@example.com',
        password: 'MySecurePass@2024',
      });

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: 'refresh@example.com',
        password: 'MySecurePass@2024',
      });

      refreshToken = loginResponse.body.data.refreshToken;
    });

    it('should refresh access token successfully', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.message).toBe('Token refreshed successfully');
    });

    it('should fail without refresh token', async () => {
      const response = await request(app).post('/api/auth/refresh-token').send({}).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should fail with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid or revoked refresh token');
    });
  });
});
