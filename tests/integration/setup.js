// Test Setup and Utilities
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

let mongoServer;

// Connect to test database
export const connectTestDB = async () => {
  try {
    // Disconnect if already connected
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Create and connect to in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log('✅ Test Database Connected (In-Memory)');
  } catch (error) {
    console.error('❌ Database Connection Error:', error);
    throw error;
  }
};

// Disconnect from database
export const disconnectTestDB = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('✅ Test Database Disconnected');
  } catch (error) {
    console.error('❌ Database Disconnection Error:', error);
    throw error;
  }
};

// Clear all database collections
export const cleanDB = async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error('❌ Database Cleanup Error:', error);
    throw error;
  }
};

// Create a test user
export const createTestUser = async (app, overrides = {}) => {
  const userData = {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    role: 'user',
    ...overrides
  };

  // Register user
  const registerRes = await request(app)
    .post('/api/v1/auth/register')
    .send(userData);

  if (registerRes.status !== 201 && registerRes.status !== 200) {
    throw new Error(`Failed to create test user: ${registerRes.body.message}`);
  }

  // Login to get token
  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: userData.email,
      password: userData.password
    });

  if (loginRes.status !== 200) {
    throw new Error(`Failed to login test user: ${loginRes.body.message}`);
  }

  return {
    user: loginRes.body.data.user,
    token: loginRes.body.data.token,
    email: userData.email,
    password: userData.password
  };
};

// Create a test psychologist
export const createTestPsychologist = async (app, overrides = {}) => {
  const psychologistData = {
    name: 'Dr. Test Psychologist',
    email: `psychologist-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    role: 'psychologist',
    ...overrides
  };

  // Register psychologist
  const registerRes = await request(app)
    .post('/api/v1/auth/register')
    .send(psychologistData);

  if (registerRes.status !== 201 && registerRes.status !== 200) {
    throw new Error(`Failed to create test psychologist: ${registerRes.body.message}`);
  }

  // Login to get token
  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: psychologistData.email,
      password: psychologistData.password
    });

  if (loginRes.status !== 200) {
    throw new Error(`Failed to login test psychologist: ${loginRes.body.message}`);
  }

  return {
    user: loginRes.body.data.user,
    token: loginRes.body.data.token,
    email: psychologistData.email,
    password: psychologistData.password
  };
};

// Create a test appointment
export const createTestAppointment = async (app, token, overrides = {}) => {
  const future = new Date();
  future.setDate(future.getDate() + 7);

  const appointmentData = {
    date: future.toISOString(),
    duration: 60,
    description: 'Test Appointment',
    ...overrides
  };

  const res = await request(app)
    .post('/api/v1/appointments')
    .set('Authorization', `Bearer ${token}`)
    .send(appointmentData);

  if (res.status !== 201) {
    throw new Error(`Failed to create test appointment: ${res.body.message}`);
  }

  return res.body.data;
};

// Login user and get token
export const loginTestUser = async (app, email, password) => {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password });

  if (res.status !== 200) {
    throw new Error(`Login failed: ${res.body.message}`);
  }

  return {
    token: res.body.data.token,
    user: res.body.data.user
  };
};

// Create multiple test users
export const createMultipleTestUsers = async (app, count = 3) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const user = await createTestUser(app, {
      name: `Test User ${i + 1}`,
      email: `test-user-${i + 1}-${Date.now()}@example.com`
    });
    users.push(user);
  }
  return users;
};

// Generate JWT manually (without login)
export const generateTestToken = (userId) => {
  return jwt.sign(
    { id: userId, role: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export default {
  connectTestDB,
  disconnectTestDB,
  cleanDB,
  createTestUser,
  createTestPsychologist,
  createTestAppointment,
  loginTestUser,
  createMultipleTestUsers,
  generateTestToken
};
