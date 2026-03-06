import request from 'supertest';
import app from '../../app.js';
import Appointment from '../../models/appointment.js';
import User from '../../models/user.js';

let token;
let user;

beforeEach(async () => {
  await User.deleteMany({});
  await Appointment.deleteMany({});

  // Create test user
  user = await User.create({
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

describe('User Controller', () => {
  describe('GET /api/users/profile', () => {
    it('should get user profile successfully', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      if (response.status !== 200) {
        throw new Error(`Get profile failed: ${JSON.stringify(response.body)}`);
      }

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.id).toBe(user._id.toString());
      expect(response.body.data.user.name).toBe(user.name);
      expect(response.body.data.user.email).toBe(user.email);
      expect(response.body.data.user).not.toHaveProperty('password');
      expect(response.body.data.user).not.toHaveProperty('twoFASecret');
      expect(response.body.message).toBe('Profile retrieved successfully');
    });

    it('should fail without authorization', async () => {
      const response = await request(app).get('/api/users/profile').expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No token provided');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe(updateData.name);
      expect(response.body.data.user.email).toBe(
        updateData.email.toLowerCase(),
      );
      expect(response.body.message).toBe('Profile updated successfully');
    });

    it('should update only name', async () => {
      const updateData = {
        name: 'Only Name Updated',
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe(updateData.name);
      expect(response.body.data.user.email).toBe(user.email);
    });

    it('should fail with invalid email', async () => {
      const updateData = {
        email: 'invalid-email',
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should fail with duplicate email', async () => {
      // Create another user with different email
      await User.create({
        name: 'Other User',
        email: 'other@example.com',
        password: 'MySecurePass@2024',
      });

      const updateData = {
        email: 'other@example.com',
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email already in use');
    });

    it('should fail with short name', async () => {
      const updateData = {
        name: 'A',
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('POST /api/users/change-password', () => {
    it('should change password successfully', async () => {
      const changeData = {
        currentPassword: 'Password123',
        newPassword: 'NewPassword456',
      };

      const response = await request(app)
        .post('/api/users/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(changeData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.passwordChanged).toBe(true);
      expect(response.body.message).toBe('Password changed successfully');

      // Verify new password works
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'NewPassword456',
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });

    it('should fail with wrong current password', async () => {
      const changeData = {
        currentPassword: 'WrongPassword123',
        newPassword: 'NewPassword456',
      };

      const response = await request(app)
        .post('/api/users/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(changeData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Current password is incorrect');
    });

    it('should fail with weak new password', async () => {
      const changeData = {
        currentPassword: 'Password123',
        newPassword: 'weak',
      };

      const response = await request(app)
        .post('/api/users/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(changeData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should fail without current password', async () => {
      const changeData = {
        newPassword: 'NewPassword456',
      };

      const response = await request(app)
        .post('/api/users/change-password')
        .set('Authorization', `Bearer ${token}`)
        .send(changeData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('POST /api/users/deactivate', () => {
    it('should deactivate account successfully', async () => {
      const response = await request(app)
        .post('/api/users/deactivate')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accountDeactivated).toBe(true);
      expect(response.body.message).toBe('Account deactivated successfully');

      // Verify user is deactivated
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.isActive).toBe(false);
    });
  });

  describe('GET /api/users/stats', () => {
    beforeEach(async () => {
      // Create test appointments
      await Appointment.create([
        {
          user: user._id,
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          description: 'Scheduled appointment',
          status: 'scheduled',
        },
        {
          user: user._id,
          date: new Date(Date.now() + 48 * 60 * 60 * 1000),
          description: 'Confirmed appointment',
          status: 'scheduled',
        },
        {
          user: user._id,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          description: 'Completed appointment',
          status: 'completed',
        },
      ]);
    });

    it('should get user stats successfully', async () => {
      const response = await request(app)
        .get('/api/users/stats')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.stats).toHaveProperty('appointments');
      expect(response.body.data.stats).toHaveProperty('sessions');
      expect(response.body.data.stats).toHaveProperty('account');

      // Check appointment stats
      expect(response.body.data.stats.appointments.total).toBe(3);
      expect(response.body.data.stats.appointments.upcoming).toBe(2);
      expect(response.body.data.stats.appointments.completed).toBe(1);
      expect(response.body.data.stats.appointments.completionRate).toBe('33.3');

      // Check account stats
      expect(response.body.data.stats.account.createdAt).toBeDefined();
      expect(response.body.data.stats.account.twoFAEnabled).toBe(false);
      expect(response.body.data.stats.account.role).toBe('user');

      expect(response.body.message).toBe(
        'User statistics retrieved successfully',
      );
    });
  });

  describe('DELETE /api/users/delete-data', () => {
    it('should delete all user data successfully with correct password', async () => {
      // TODO: Fix validation issue causing 400
      // Create some appointments first
      await Appointment.create({
        user: user._id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        description: 'Test appointment',
        status: 'scheduled',
      });

      const response = await request(app)
        .delete('/api/users/delete-data')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'MySecurePass@2024',
        });

      if (response.status === 200) {
        expect(response.body.success).toBe(true);
        expect(response.body.data.dataDeleted).toBe(true);
        expect(response.body.data.deletedItems.appointments).toBe(1);
        expect(response.body.data.deletedItems.sessions).toBe(1);
      } else {
        // Debug: Show error if not 200
        console.log('GDPR Error Status:', response.status);
        console.log('GDPR Error Body:', response.body);
      }

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.dataDeleted).toBe(true);
      expect(response.body.data.deletedItems.appointments).toBe(1);
      expect(response.body.data.deletedItems.sessions).toBe(1);
      expect(response.body.message).toBe('User data deleted successfully');

      // Verify appointments are deleted
      const appointments = await Appointment.countDocuments({
        user: user._id,
      });
      expect(appointments).toBe(0);

      // Verify user still exists but is marked as inactive
      const updatedUser = await User.findById(user._id);
      expect(updatedUser).toBeDefined();
      expect(updatedUser.isActive).toBe(false);
    });

    it('should fail with incorrect password', async () => {
      // TODO: Fix error handling causing 500 instead of 400
      const response = await request(app)
        .delete('/api/users/delete-data')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'WrongPassword@2024',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Password is incorrect');

      // Verify user data is NOT deleted
      const appointments = await Appointment.countDocuments({
        user: user._id,
      });
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.isActive).toBe(true);
    });

    it('should fail without password', async () => {
      const response = await request(app)
        .delete('/api/users/delete-data')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail without authorization', async () => {
      const response = await request(app)
        .delete('/api/users/delete-data')
        .send({
          password: 'MySecurePass@2024',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
