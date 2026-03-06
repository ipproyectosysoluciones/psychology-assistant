/**
 * @file Jest Setup for Backend Tests
 * @description Configuración global para tests del backend.
 * ES: Configurar variables de entorno, conectar DB de prueba, limpiar después de tests.
 * EN: Set environment variables, connect to test DB, clean up after tests.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Increase Jest timeout for database operations
jest.setTimeout(30000);

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  // Keep error and warn for debugging
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};

/**
 * Connect to test MongoDB before running tests
 */
beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/psychology-assistant-test');
  }
});

/**
 * Clean up after all tests
 */
afterAll(async () => {
  await mongoose.connection.close();
});

/**
 * Clear all collections after each test
 */
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
