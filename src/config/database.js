import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

dotenv.config();

let mongoServer;

/**
 * @module connectDB
 * @description Función asincrónica para conectarse a la base de datos MongoDB.
 * ES: En desarrollo usa MongoDB en memoria, en producción usa la URI configurada.
 * EN: In development uses in-memory MongoDB, in production uses configured URI.
 */
const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'test') {
      // Use in-memory database for testing
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Memory Connected: ${conn.connection.host}`);
    } else if (process.env.NODE_ENV === 'development') {
      // Development: use DATABASE_URL if provided, otherwise in-memory
      if (process.env.DATABASE_URL || process.env.MONGO_URI) {
        const mongoUri = process.env.DATABASE_URL || process.env.MONGO_URI;
        const conn = await mongoose.connect(mongoUri);
        console.log(`✅ MongoDB Connected (Real): ${conn.connection.host}`);
      } else {
        // Fallback to in-memory if no URI provided
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        const conn = await mongoose.connect(mongoUri);
        console.log(
          `⚠️  MongoDB Memory Connected (Dev-only): ${conn.connection.host}`
        );
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
      console.log(`✅ MongoDB Connected (Production): ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * @module disconnectDB
 * @description Función para desconectar la base de datos y detener el servidor en memoria.
 * ES: Cierra la conexión de Mongoose y detiene el servidor MongoDB en memoria.
 * EN: Closes Mongoose connection and stops in-memory MongoDB server.
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error(`Error disconnecting from MongoDB: ${error.message}`);
  }
};

export { connectDB, disconnectDB };

export default connectDB;
