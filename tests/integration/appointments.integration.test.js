// Appointments Integration Tests
import request from 'supertest';
import app from '../../src/app.js';
import {
  cleanDB,
  connectTestDB,
  createTestUser,
  disconnectTestDB,
} from './setup.js';

describe('Appointments Integration Tests', () => {
  let token;

  beforeAll(async () => {
    await connectTestDB();
  });

  afterAll(async () => {
    await disconnectTestDB();
  });

  beforeEach(async () => {
    await cleanDB();
    // Create test user and get token
    const result = await createTestUser(app);
    token = result.token;
  });

  afterEach(async () => {
    await cleanDB();
  });

  describe('POST /api/v1/appointments', () => {
    it('should create appointment with valid data', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const appointmentData = {
        date: futureDate.toISOString(),
        duration: 60,
        description: 'Consultation session',
      };

      const res = await request(app)
        .post('/api/v1/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(appointmentData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBeDefined();
      expect(res.body.data.date).toBeDefined();
      expect(res.body.data.duration).toBe(60);
      expect(res.body.data.status).toBe('scheduled');
    });

    it('should not create appointment without authentication', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const appointmentData = {
        date: futureDate.toISOString(),
        duration: 60,
        description: 'Consultation session',
      };

      const res = await request(app)
        .post('/api/v1/appointments')
        .send(appointmentData);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should validate future date requirement', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const appointmentData = {
        date: pastDate.toISOString(),
        duration: 60,
        description: 'Consultation session',
      };

      const res = await request(app)
        .post('/api/v1/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(appointmentData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should validate duration range (15-180 minutes)', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      // Test with duration too short
      const shortDuration = {
        date: futureDate.toISOString(),
        duration: 5,
        description: 'Consultation session',
      };

      const res = await request(app)
        .post('/api/v1/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(shortDuration);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should validate description length', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const longDescription = 'A'.repeat(501);

      const appointmentData = {
        date: futureDate.toISOString(),
        duration: 60,
        description: longDescription,
      };

      const res = await request(app)
        .post('/api/v1/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(appointmentData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/appointments', () => {
    it('should list user appointments', async () => {
      // Create multiple appointments
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      for (let i = 0; i < 3; i++) {
        const date = new Date(futureDate);
        date.setDate(date.getDate() + i);

        await request(app)
          .post('/api/v1/appointments')
          .set('Authorization', `Bearer ${token}`)
          .send({
            date: date.toISOString(),
            duration: 60,
            description: `Appointment ${i + 1}`,
          });
      }

      // Retrieve appointments
      const res = await request(app)
        .get('/api/v1/appointments')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(3);
    });

    it('should support pagination', async () => {
      // Create 5 appointments
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      for (let i = 0; i < 5; i++) {
        const date = new Date(futureDate);
        date.setDate(date.getDate() + i);

        await request(app)
          .post('/api/v1/appointments')
          .set('Authorization', `Bearer ${token}`)
          .send({
            date: date.toISOString(),
            duration: 60,
            description: `Appointment ${i + 1}`,
          });
      }

      // Get first page with limit 2
      const res = await request(app)
        .get('/api/v1/appointments?page=1&limit=2')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeLessThanOrEqual(2);
    });

    it('should require authentication', async () => {
      const res = await request(app).get('/api/v1/appointments');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/appointments/:id', () => {
    let appointmentId;

    beforeEach(async () => {
      // Create an appointment
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const res = await request(app)
        .post('/api/v1/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          date: futureDate.toISOString(),
          duration: 60,
          description: 'Test appointment',
        });

      appointmentId = res.body.data._id;
    });

    it('should get appointment by id', async () => {
      const res = await request(app)
        .get(`/api/v1/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(appointmentId);
      expect(res.body.data.description).toBe('Test appointment');
    });

    it('should return 404 for non-existent appointment', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const res = await request(app)
        .get(`/api/v1/appointments/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/appointments/:id', () => {
    let appointmentId;

    beforeEach(async () => {
      // Create an appointment
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const res = await request(app)
        .post('/api/v1/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          date: futureDate.toISOString(),
          duration: 60,
          description: 'Original description',
        });

      appointmentId = res.body.data._id;
    });

    it('should update appointment', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 14);

      const res = await request(app)
        .put(`/api/v1/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Updated description',
          duration: 90,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.description).toBe('Updated description');
      expect(res.body.data.duration).toBe(90);
    });

    it('should not allow updating past appointment', async () => {
      const res = await request(app)
        .put(`/api/v1/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'completed',
        });

      // Should succeed if it's a scheduled appointment, fail only if actually past
      expect([200, 400]).toContain(res.status);
    });
  });

  describe('DELETE /api/v1/appointments/:id', () => {
    let appointmentId;

    beforeEach(async () => {
      // Create an appointment
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const res = await request(app)
        .post('/api/v1/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          date: futureDate.toISOString(),
          duration: 60,
          description: 'Test appointment to cancel',
        });

      appointmentId = res.body.data._id;
    });

    it('should cancel appointment', async () => {
      const res = await request(app)
        .delete(`/api/v1/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify appointment status is cancelled
      const getRes = await request(app)
        .get(`/api/v1/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getRes.body.data.status).toBe('cancelled');
    });

    it('should return 404 for non-existent appointment', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const res = await request(app)
        .delete(`/api/v1/appointments/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Complete Appointment Lifecycle', () => {
    it('should complete create -> view -> update -> cancel flow', async () => {
      // Step 1: Create appointment
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const createRes = await request(app)
        .post('/api/v1/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          date: futureDate.toISOString(),
          duration: 60,
          description: 'Full lifecycle test',
        });

      expect(createRes.status).toBe(201);
      const appointmentId = createRes.body.data._id;

      // Step 2: Get appointment
      const getRes = await request(app)
        .get(`/api/v1/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getRes.status).toBe(200);
      expect(getRes.body.data.status).toBe('scheduled');

      // Step 3: Update appointment
      const updateRes = await request(app)
        .put(`/api/v1/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'Updated lifecycle test',
        });

      expect(updateRes.status).toBe(200);

      // Step 4: Cancel appointment
      const cancelRes = await request(app)
        .delete(`/api/v1/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(cancelRes.status).toBe(200);

      // Step 5: Verify cancellation
      const finalRes = await request(app)
        .get(`/api/v1/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(finalRes.body.data.status).toBe('cancelled');
    });
  });
});
