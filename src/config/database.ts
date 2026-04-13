import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import pino from 'pino';

dotenv.config({ quiet: true });

/**
 * @module logger
 * @description Logger para base de datos.
 * ES: Usa pino directamente para evitar dependencia circular.
 * EN: Uses pino directly to avoid circular dependency.
 */
const logger = pino({ name: 'database' });

let mongoServer: MongoMemoryServer | null = null;

/**
 * @module connectDB
 * @description Función asincrónica para conectarse a la base de datos MongoDB.
 * ES: En desarrollo usa MongoDB en memoria, en producción usa la URI configurada.
 * EN: In development uses in-memory MongoDB, in production uses configured URI.
 */
const connectDB = async (): Promise<void> => {
  try {
    if (process.env.NODE_ENV === 'test') {
      // Use in-memory database for testing
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      logger.info({ host: conn.connection.host }, 'MongoDB Memory Connected');
    } else if (process.env.NODE_ENV === 'development') {
      // Development: use DATABASE_URL if provided, otherwise in-memory
      if (process.env.DATABASE_URL || process.env.MONGO_URI) {
        const mongoUri = (process.env.DATABASE_URL || process.env.MONGO_URI) as string;
        const conn = await mongoose.connect(mongoUri);
        logger.info({ host: conn.connection.host }, 'MongoDB Connected (Real)');
      } else {
        // Fallback to in-memory if no URI provided
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        const conn = await mongoose.connect(mongoUri);
        logger.warn({ host: conn.connection.host }, 'MongoDB Memory Connected (Dev-only)');
      }
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
