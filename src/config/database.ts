import dotenv from 'dotenv';
import mongoose from 'mongoose';
import pino from 'pino';

// Dynamic import for mongodb-memory-server (only loaded when needed)
import type { MongoMemoryServer as MongoMemoryServerType } from 'mongodb-memory-server';

dotenv.config({ quiet: true });

/**
 * @module logger
 * @description Logger para base de datos.
 * ES: Usa pino directamente para evitar dependencia circular.
 * EN: Uses pino directly to avoid circular dependency.
 */
const logger = pino({ name: 'database' });

let mongoServer: MongoMemoryServerType | null = null;

/**
 * @module connectDB
 * @description Función asincrónica para conectarse a la base de datos MongoDB.
 * ES: En desarrollo usa MongoDB en memoria, en producción usa la URI configurada.
 * EN: In development uses in-memory MongoDB, in production uses configured URI.
 */
const connectDB = async (): Promise<void> => {
  try {
    if (
      process.env.NODE_ENV === 'test' ||
      (process.env.NODE_ENV === 'development' &&
        !process.env.DATABASE_URL &&
        !process.env.MONGO_URI)
    ) {
      // Use in-memory database for testing OR development without URI
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      logger.info({ host: conn.connection.host }, 'MongoDB Memory Connected');
    } else if (process.env.NODE_ENV === 'development') {
      // Development: use DATABASE_URL if provided, otherwise fail
      const mongoUri = (process.env.DATABASE_URL || process.env.MONGO_URI) as string;
      if (!mongoUri) {
        throw new Error(
          'DATABASE_URL or MONGO_URI environment variable is required for development'
        );
      }
      const conn = await mongoose.connect(mongoUri);
      logger.info({ host: conn.connection.host }, 'MongoDB Connected (Real)');
    } else {
      // Production: use MONGO_URI or DATABASE_URL
      const mongoUri = process.env.MONGO_URI || process.env.DATABASE_URL;
      if (!mongoUri) {
        throw new Error(
          'MONGO_URI or DATABASE_URL environment variable is required for production'
        );
      }
      const conn = await mongoose.connect(mongoUri);
      logger.info({ host: conn.connection.host }, 'MongoDB Connected (Production)');
    }
  } catch (error) {
    logger.fatal({ error: (error as Error).message }, 'MongoDB connection error');
    process.exit(1);
  }
};

/**
 * @module disconnectDB
 * @description Función para desconectar la base de datos y detener el servidor en memoria.
 * ES: Cierra la conexión de Mongoose y detiene el servidor MongoDB en memoria.
 * EN: Closes Mongoose connection and stops in-memory MongoDB server.
 */
const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error({ error: (error as Error).message }, 'Error disconnecting from MongoDB');
  }
};

export { connectDB, disconnectDB };

export default connectDB;
