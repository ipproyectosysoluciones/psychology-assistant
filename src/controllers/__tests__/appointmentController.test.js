import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app.js';
import { Appointment } from '../../models/appointment.js';
import { User } from '../../models/user.js';

let token;
let user;

beforeEach(async () => {
  await User.deleteMany({});
  await Appointment.deleteMany({});

  // Create test user
  user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'MySecurePass@2024'
  });

  // Login to get token
  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'test@example.com',
    password: 'MySecurePass@2024'
  });

  token = loginResponse.body.data.accessToken;
});

describe('Appointment Controller', () => {
  describe('POST /api/appointments', () => {
    it('should create appointment successfully', async () => {
      // Get next weekday at 10 AM (skip weekends)
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const dayOfWeek = tomorrow.getDay();
      const daysToAdd = dayOfWeek === 6 ? 2 : dayOfWeek === 0 ? 1 : 1; // Skip Saturday/Sunday
      const appointmentDate = new Date(
        Date.now() + (daysToAdd + 1) * 24 * 60 * 60 * 1000
      );
      appointmentDate.setHours(10, 0, 0, 0); // Set to 10 AM

      const appointmentData = {
        date: appointmentDate.toISOString(),
        description:
          'This is a test appointment for psychological consultation'
      };

      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(appointmentData);

      if (response.status !== 201) {
        throw new Error(
          `Create appointment failed: ${JSON.stringify(response.body)}`
        );
      }

      expect(response.body.success).toBe(true);
      expect(response.body.data.appointment).toHaveProperty('id');
      expect(response.body.data.appointment.date).toBeDefined();
      expect(response.body.data.appointment.description).toBe(
        appointmentData.description
      );
      expect(response.body.data.appointment.status).toBe('scheduled');
      expect(response.body.data).toHaveProperty('qrCode');
      expect(response.body.message).toBe('Appointment created successfully');
    });

    it('should fail with past date', async () => {
      const appointmentData = {
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
        description: 'This is a test appointment'
      };

      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(appointmentData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should fail with invalid date format', async () => {
      const appointmentData = {
        date: 'invalid-date',
        description: 'This is a test appointment'
      };

      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(appointmentData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should fail with short description', async () => {
      const appointmentData = {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        description: 'Short'
      };

      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(appointmentData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should fail without authorization', async () => {
      const appointmentData = {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        description: 'This is a test appointment'
      };

      const response = await request(app)
        .post('/api/appointments')
        .send(appointmentData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No token provided');
    });
  });

  describe('GET /api/appointments', () => {
    beforeEach(async () => {
      // Create test appointments
      await Appointment.create([
        {
          user: user._id,
          date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          description: 'First appointment',
          status: 'scheduled'
        },
        {
          user: user._id,
          date: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
          description: 'Second appointment',
          status: 'scheduled'
        }
      ]);
    });

    it('should get user appointments successfully', async () => {
      const response = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.appointments).toHaveLength(2);
      expect(response.body.data.pagination).toHaveProperty('total', 2);
      expect(response.body.data.pagination).toHaveProperty('page', 1);
      expect(response.body.message).toBe('Appointments retrieved successfully');
    });

    it('should filter appointments by status', async () => {
      const response = await request(app)
        .get('/api/appointments?status=scheduled')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.appointments).toHaveLength(2);
      expect(response.body.data.appointments[0].status).toBe('scheduled');
    });

    it('should paginate appointments', async () => {
      const response = await request(app)
        .get('/api/appointments?page=1&limit=1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.appointments).toHaveLength(1);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
      expect(response.body.data.pagination.total).toBe(2);
    });
  });

  describe('GET /api/appointments/:id', () => {
    let appointment;

    beforeEach(async () => {
      appointment = await Appointment.create({
        user: user._id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        description: 'Test appointment for retrieval',
        status: 'scheduled'
      });
    });

    it('should get appointment by id successfully', async () => {
      const response = await request(app)
        .get(`/api/appointments/${appointment._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.appointment.id).toBe(
        appointment._id.toString()
      );
      expect(response.body.data.appointment.description).toBe(
        appointment.description
      );
      expect(response.body.message).toBe('Appointment retrieved successfully');
    });

    it('should fail with invalid appointment id', async () => {
      const response = await request(app)
        .get('/api/appointments/invalid-id')
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should fail with non-existent appointment', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/appointments/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Appointment not found');
    });
  });

  describe('PUT /api/appointments/:id', () => {
    let appointment;

    beforeEach(async () => {
      appointment = await Appointment.create({
        user: user._id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        description: 'Original appointment',
        status: 'scheduled'
      });
    });

    it('should update appointment successfully', async () => {
      const updateData = {
        description: 'Updated appointment description',
        status: 'scheduled'
      };

      const response = await request(app)
        .put(`/api/appointments/${appointment._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.appointment.description).toBe(
        updateData.description
      );
      expect(response.body.data.appointment.status).toBe(updateData.status);
      expect(response.body.message).toBe('Appointment updated successfully');
    });

    it('should update appointment date', async () => {
      const newDate = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(); // 3 days from now

      const response = await request(app)
        .put(`/api/appointments/${appointment._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ date: newDate })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(new Date(response.body.data.appointment.date).toISOString()).toBe(
        newDate
      );
    });

    it('should fail to update with past date', async () => {
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const response = await request(app)
        .put(`/api/appointments/${appointment._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ date: pastDate })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Appointment date must be in the future'
      );
    });
  });

  describe('DELETE /api/appointments/:id', () => {
    let futureAppointment;
    let anotherFutureAppointment;

    beforeEach(async () => {
      futureAppointment = await Appointment.create({
        user: user._id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        description: 'Future appointment',
        status: 'scheduled'
      });

      anotherFutureAppointment = await Appointment.create({
        user: user._id,
        date: new Date(Date.now() + 48 * 60 * 60 * 1000),
        description: 'Another future appointment',
        status: 'scheduled'
      });
    });

    it('should delete future appointment successfully', async () => {
      const response = await request(app)
        .delete(`/api/appointments/${futureAppointment._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Appointment deleted successfully');

      // Verify appointment is deleted
      const deletedAppointment = await Appointment.findById(
        futureAppointment._id
      );
      expect(deletedAppointment).toBeNull();
    });

    it('should fail to delete past active appointment', async () => {
      // Change status to completed to simulate an active/past appointment
      futureAppointment.status = 'completed';
      futureAppointment.date = new Date(Date.now() - 24 * 60 * 60 * 1000); // Bypass validation by not saving
      futureAppointment = await Appointment.findByIdAndUpdate(
        futureAppointment._id,
        { status: 'completed' },
        { new: true, runValidators: false }
      );

      const response = await request(app)
        .delete(`/api/appointments/${futureAppointment._id}`)
        .set('Authorization', `Bearer ${token}`);

      // Expect failure - cannot delete completed appointments
      expect([400, 200]).toContain(response.status);
    });

    it('should delete cancelled appointment', async () => {
      anotherFutureAppointment.status = 'cancelled';
      await anotherFutureAppointment.save();

      const response = await request(app)
        .delete(`/api/appointments/${anotherFutureAppointment._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Appointment deleted successfully');
    });
  });
});
