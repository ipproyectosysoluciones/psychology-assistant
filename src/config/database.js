import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @module connectDB
 * @description Función asincrónica para conectarse a la base de datos MongoDB.
 *
 * Intenta establecer una conexión mediante la variable de entorno `MONGO_URI`.
 * Si tiene éxito, registra la información del host de conexión.
 * Si ocurre un error durante el intento de conexión, registra el mensaje de error y sale del proceso con un estado de falla.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect( process.env.MONGO_URI );
    console.log( `MongoDB Connected: ${conn.connection.host}` );
  } catch ( error ) {
    console.error( `Error: ${error.message}` );
    process.exit( 1 ); // Exit process with failure
  }
};

export default connectDB;