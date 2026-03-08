/**
 * Clinic Controller Tests
 */

import { beforeEach, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';
import { Clinic } from '../../models/index.js';
import { User } from '../../models/user.js';

let authToken;

beforeEach(async () => {
  // Clean up database
  await User.deleteMany({});
  await Clinic.deleteMany({});

  // Create test user directly in database
  await User.create({
    name: 'Clinic Test User',
    email: 'clinictest@example.com',
    password: 'ClinicTest@123'
  });

  // Login to get valid token
  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'clinictest@example.com',
    password: 'ClinicTest@123'
  });

  if (loginResponse.status === 200) {
    authToken = loginResponse.body.data.accessToken;
  } else {
    throw new Error(`Failed to login: ${JSON.stringify(loginResponse.body)}`);
  }
});

describe('Clinic Controller', () => {
  let clinicId;

  describe('POST /api/v1/clinics', () => {
    it('should create a new clinic', async () => {
      const response = await request(app)
        .post('/api/v1/clinics')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Clinic',
          description: 'A test clinic',
          address: '123 Main St',
          phone: '+57 1 2345678',
          email: 'clinic@test.com',
          country: 'Colombia',
          currency: 'COP'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.name).toBe('Test Clinic');
      clinicId = response.body.data._id;
    });

    it('should fail without required fields', async () => {
      const response = await request(app)
        .post('/api/v1/clinics')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Clinic'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET Clinic by ID', () => {
    beforeEach(async () => {
      // Create a clinic for this test suite
      const createResponse = await request(app)
        .post('/api/v1/clinics')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Get Test Clinic',
          description: 'A clinic for GET tests',
          address: '456 Main St',
          phone: '+57 1 2345678',
          email: 'getclinic@test.com',
          country: 'Colombia',
          currency: 'COP'
        });

      if (createResponse.status === 201) {
        clinicId = createResponse.body.data._id;
      }
    });

    it('should get a clinic by id', async () => {
      const response = await request(app)
        .get(`/api/v1/clinics/${clinicId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(clinicId);
    });

    it('should return 404 for non-existent clinic', async () => {
      const response = await request(app)
        .get('/api/v1/clinics/507f1f77bcf86cd799439099')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/v1/clinics/:id', () => {
    beforeEach(async () => {
      // Create a clinic for this test suite
      const createResponse = await request(app)
        .post('/api/v1/clinics')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Update Test Clinic',
          description: 'A clinic for update tests',
          address: '789 Main St',
          phone: '+57 1 2345678',
          email: 'updateclinic@test.com',
          country: 'Colombia',
          currency: 'COP'
        });

      if (createResponse.status === 201) {
        clinicId = createResponse.body.data._id;
      }
    });

    it('should update a clinic', async () => {
      const response = await request(app)
        .put(`/api/v1/clinics/${clinicId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Clinic',
          description: 'Updated description'
        });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Updated Clinic');
    });
  });

  describe('DELETE /api/v1/clinics/:id', () => {
    beforeEach(async () => {
      // Create a clinic for this test suite
      const createResponse = await request(app)
        .post('/api/v1/clinics')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Delete Test Clinic',
          description: 'A clinic for delete tests',
          address: '321 Main St',
          phone: '+57 1 2345678',
          email: 'deleteclinic@test.com',
          country: 'Colombia',
          currency: 'COP'
        });

      if (createResponse.status === 201) {
        clinicId = createResponse.body.data._id;
      }
    });

    it('should delete a clinic', async () => {
      const response = await request(app)
        .delete(`/api/v1/clinics/${clinicId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
