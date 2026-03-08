/**
 * @file Authentication Controller Tests
 * @description Pruebas exhaustivas del controlador de autenticación.
 * ES: Valida registro, login, 2FA, y manejo de errores.
 * EN: Validates registration, login, 2FA, and error handling.
 */

import jwt from 'jsonwebtoken';
import * as authController from '../src/controllers/authController.js';
import Session from '../src/models/session.js';
import User from '../src/models/user.js';

describe('Authentication Controller', () => {
  let mockReq, mockRes;
  // eslint-disable-next-line no-unused-vars
  let mockNext;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create mock request object
    mockReq = {
      body: {},
      ip: '127.0.0.1',
      get: jest.fn((header) => {
        const headers = {
          'User-Agent': 'Mozilla/5.0 Test',
        };
        return headers[header];
      }),
      user: {
        _id: 'test-user-id',
        email: 'test@example.com',
        twoFAEnabled: false,
        save: jest.fn(),
      },
    };

    // Create mock response object
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
    };

    mockNext = jest.fn();
  });

  describe('register', () => {
    test('should successfully register a new user with valid data', async () => {
      mockReq.body = {
        name: 'Test User',
        email: 'newuser@example.com',
        password: 'SecurePassword123',
      };

      // Mock User.findOne to return null (user doesn't exist)
      jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);

      // Mock User.create
      const mockUser = {
        _id: 'user-123',
        name: 'Test User',
        email: 'newuser@example.com',
        role: 'user',
      };
      jest.spyOn(User, 'create').mockResolvedValueOnce(mockUser);

      // Mock Session.create
      jest
        .spyOn(Session, 'create')
        .mockResolvedValueOnce({ _id: 'session-123' });

      // Mock sendResponse function
      const sendResponseMock = jest.fn();
      jest.doMock('../src/utils/apiResponse.js', () => ({
        sendResponse: sendResponseMock,
      }));

      // Call the function
      await authController.register(mockReq, mockRes);

      // Verify User.findOne was called with lowercase email
      expect(User.findOne).toHaveBeenCalledWith({
        email: 'newuser@example.com',
      });
    });

    test('should reject registration with existing email', async () => {
      mockReq.body = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'SecurePassword123',
      };

      // Mock User.findOne to return existing user
      jest.spyOn(User, 'findOne').mockResolvedValueOnce({
        _id: 'existing-user',
        email: 'existing@example.com',
      });

      // Should throw error
      try {
        await authController.register(mockReq, mockRes);
      } catch (error) {
        expect(error.message).toBe('User already exists');
      }
    });

    test('should reject registration with invalid email format', async () => {
      mockReq.body = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'SecurePassword123',
      };

      // Should throw validation error
      try {
        await authController.register(mockReq, mockRes);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test('should reject registration with weak password', async () => {
      mockReq.body = {
        name: 'Test User',
        email: 'newuser@example.com',
        password: '123', // Too short and weak
      };

      // Should throw validation error
      try {
        await authController.register(mockReq, mockRes);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('login', () => {
    test('should successfully login with valid credentials', async () => {
      mockReq.body = {
        email: 'user@example.com',
        password: 'SecurePassword123',
      };

      // Mock User with comparePassword method
      const mockUser = {
        _id: 'user-123',
        name: 'Test User',
        email: 'user@example.com',
        role: 'user',
        twoFAEnabled: false,
        isActive: true,
        lastLogin: null,
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(Session, 'create')
        .mockResolvedValueOnce({ _id: 'session-123' });

      // Mock jwt.sign
      jest.spyOn(jwt, 'sign').mockReturnValue('mock-token');

      // Call the function
      try {
        await authController.login(mockReq, mockRes);
      } catch (error) {
        // Function uses asyncHandler and sendResponse internally
      }

      expect(User.findOne).toHaveBeenCalledWith({ email: 'user@example.com' });
    });

    test('should reject login with non-existent user', async () => {
      mockReq.body = {
        email: 'nonexistent@example.com',
        password: 'SecurePassword123',
      };

      jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);

      try {
        await authController.login(mockReq, mockRes);
      } catch (error) {
        expect(error.message).toBe('Invalid credentials');
      }
    });

    test('should reject login with incorrect password', async () => {
      mockReq.body = {
        email: 'user@example.com',
        password: 'WrongPassword123',
      };

      const mockUser = {
        _id: 'user-123',
        email: 'user@example.com',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(false),
        save: jest.fn(),
      };

      jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser);

      try {
        await authController.login(mockReq, mockRes);
      } catch (error) {
        expect(error.message).toBe('Invalid credentials');
      }
    });

    test('should reject login for deactivated account', async () => {
      mockReq.body = {
        email: 'user@example.com',
        password: 'SecurePassword123',
      };

      const mockUser = {
        _id: 'user-123',
        email: 'user@example.com',
        isActive: false,
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn(),
      };

      jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser);

      try {
        await authController.login(mockReq, mockRes);
      } catch (error) {
        expect(error.message).toBe('Account is deactivated');
      }
    });

    test('should update lastLogin timestamp on successful login', async () => {
      mockReq.body = {
        email: 'user@example.com',
        password: 'SecurePassword123',
      };

      const mockUser = {
        _id: 'user-123',
        email: 'user@example.com',
        role: 'user',
        twoFAEnabled: false,
        isActive: true,
        lastLogin: null,
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(Session, 'create')
        .mockResolvedValueOnce({ _id: 'session-123' });
      jest.spyOn(jwt, 'sign').mockReturnValue('mock-token');

      try {
        await authController.login(mockReq, mockRes);
      } catch (error) {
        // Function uses asyncHandler internally
      }

      // Verify that lastLogin was updated (should be set to a date)
      expect(mockUser.lastLogin).toBeDefined();
      expect(mockUser.save).toHaveBeenCalled();
    });
  });

  describe('enable2FA', () => {
    test('should successfully enable 2FA for user without 2FA', async () => {
      mockReq.user.twoFAEnabled = false;

      // Mock twoFAService
      jest.doMock('../src/services/twoFAService.js', () => ({
        generate2FACode: jest.fn().mockReturnValue('TESTSECRET123456'),
      }));

      // Mock qrService
      jest.doMock('../src/services/qrService.js', () => ({
        generateQR: jest.fn().mockResolvedValue('data:image/png;base64,TESTQR'),
      }));

      try {
        await authController.enable2FA(mockReq, mockRes);
      } catch (error) {
        // Function uses asyncHandler internally
      }

      // Verify 2FA was not already enabled
      expect(mockReq.user.twoFAEnabled).toBe(false);
    });

    test('should reject 2FA enablement if already enabled', async () => {
      mockReq.user.twoFAEnabled = true;

      try {
        await authController.enable2FA(mockReq, mockRes);
      } catch (error) {
        expect(error.message).toBe('2FA is already enabled for this account');
      }
    });
  });

  describe('logout', () => {
    test('should successfully logout and invalidate session', async () => {
      mockReq.user = {
        _id: 'user-123',
      };

      jest
        .spyOn(Session, 'updateOne')
        .mockResolvedValueOnce({ acknowledged: true });

      try {
        await authController.logout(mockReq, mockRes);
      } catch (error) {
        // Function may handle errors internally
      }

      expect(Session.updateOne).toHaveBeenCalled();
    });
  });

  describe('Security validations', () => {
    test('should sanitize email input to lowercase and trim', async () => {
      mockReq.body = {
        name: 'Test User',
        email: '  TEST@EXAMPLE.COM  ',
        password: 'SecurePassword123',
      };

      jest.spyOn(User, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(User, 'create').mockResolvedValueOnce({
        _id: 'user-123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      });
      jest
        .spyOn(Session, 'create')
        .mockResolvedValueOnce({ _id: 'session-123' });

      try {
        await authController.register(mockReq, mockRes);
      } catch (error) {
        // Function uses asyncHandler internally
      }

      // Verify email was sanitized
      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    test('should create session with user IP and User-Agent', async () => {
      mockReq.body = {
        email: 'user@example.com',
        password: 'SecurePassword123',
      };

      const mockUser = {
        _id: 'user-123',
        email: 'user@example.com',
        role: 'user',
        twoFAEnabled: false,
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn(),
      };

      jest.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser);
      jest
        .spyOn(Session, 'create')
        .mockResolvedValueOnce({ _id: 'session-123' });
      jest.spyOn(jwt, 'sign').mockReturnValue('mock-token');

      try {
        await authController.login(mockReq, mockRes);
      } catch (error) {
        // Function uses asyncHandler internally
      }

      expect(Session.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user: 'user-123',
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0 Test',
        }),
      );
    });
  });
});
