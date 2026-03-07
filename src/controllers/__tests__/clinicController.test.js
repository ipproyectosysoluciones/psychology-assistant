/**
 * Clinic Controller Tests
 */

import { beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../../app.js';

describe('Clinic Controller', () => {
  let clinicId;
  let userId;
  let authToken;

  beforeAll(async () => {
    userId = '507f1f77bcf86cd799439011';
    authToken = 'test-token-placeholder';
  });

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
          currency: 'COP',
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
          name: 'Test Clinic',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/v1/clinics/:id', () => {
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
    it('should update a clinic', async () => {
      const response = await request(app)
        .put(`/api/v1/clinics/${clinicId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Clinic',
          description: 'Updated description',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Updated Clinic');
    });
  });

  describe('DELETE /api/v1/clinics/:id', () => {
    it('should delete a clinic', async () => {
      const response = await request(app)
        .delete(`/api/v1/clinics/${clinicId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
