/**
 * @module setupTests
 * @description Configuración global para tests con Jest.
 * ES: Configura base de datos en memoria y limpieza automática.
 * EN: Sets up in-memory database and automatic cleanup.
 */

import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.test', quiet: true } as Parameters<typeof dotenv.config>[0]);

let mongoServer: MongoMemoryServer;

// Setup antes de todos los tests
beforeAll(async () => {
  // Solo conectar si no hay una conexión activa
  if (mongoose.connection.readyState === 0) {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  }
});

// Cleanup después de cada test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Cleanup después de todos los tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Mock para console.log en tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};
