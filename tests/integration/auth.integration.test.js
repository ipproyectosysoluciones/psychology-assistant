// Authentication Integration Tests
import request from 'supertest';
import app from '../../src/app.js';
import { cleanDB, connectTestDB, disconnectTestDB } from './setup.js';

describe('Authentication Integration Tests', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  afterEach(async () => {
    await cleanDB();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'TestPassword123!'
      };

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe(userData.email);
      expect(res.body.data.user.name).toBe(userData.name);
      expect(res.body.data.token).toBeDefined();
    });

    it('should not register user with duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'TestPassword123!'
      };

      // First registration
      await request(app).post('/api/v1/auth/register').send(userData);

      // Second registration with same email
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should validate email format', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'TestPassword123!'
      };

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should validate password length', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'short'
      };

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'john@example.com' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      // Create user for login tests
      await request(app).post('/api/v1/auth/register').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'TestPassword123!'
      });
    });

    it('should login user with valid credentials', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'john@example.com',
        password: 'TestPassword123!'
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('john@example.com');
    });

    it('should not login with invalid password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'john@example.com',
        password: 'WrongPassword123!'
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'TestPassword123!'
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return valid JWT token', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'john@example.com',
        password: 'TestPassword123!'
      });

      expect(res.status).toBe(200);
      const token = res.body.data.token;
      expect(token).toBeDefined();
      // Verify token has JWT format (3 parts separated by dots)
      expect(token.split('.').length).toBe(3);
    });
  });

  describe('Complete Authentication Flow', () => {
    it('should complete register -> login -> access protected route flow', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'TestPassword123!'
      };

      // Step 1: Register
      const registerRes = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(registerRes.status).toBe(201);
      expect(registerRes.body.data.token).toBeDefined();
      const token = registerRes.body.data.token;

      // Step 2: Access protected route with token
      const protectedRes = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(protectedRes.status).toBe(200);
      expect(protectedRes.body.success).toBe(true);
      expect(protectedRes.body.data.email).toBe(userData.email);

      // Step 3: Login again
      const loginRes = await request(app).post('/api/v1/auth/login').send({
        email: userData.email,
        password: userData.password
      });

      expect(loginRes.status).toBe(200);
      const newToken = loginRes.body.data.token;
      expect(newToken).toBeDefined();

      // Step 4: Use new token
      const protectedRes2 = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${newToken}`);

      expect(protectedRes2.status).toBe(200);
      expect(protectedRes2.body.data.email).toBe(userData.email);
    });

    it('should reject requests without token', async () => {
      const res = await request(app).get('/api/v1/users/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject requests with invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', 'Bearer invalid-token-here');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Logout', () => {
    it('should logout successfully', async () => {
      // Create and login user
      const registerRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'TestPassword123!'
        });

      const token = registerRes.body.data.token;

      // Verify can access before logout
      const beforeLogout = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(beforeLogout.status).toBe(200);

      // Perform logout
      const logoutRes = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.success).toBe(true);
    });
  });
});
