
/**
 * @module errorHandler
 * @description Maneja los errores en la aplicación al configurar el código de estado en función del código de estado de respuesta.
 * Si el código de estado de respuesta es 200, lo configura en 500; de lo contrario, mantiene el código de estado original.
 * Responde con un objeto JSON que contiene el mensaje de error y el seguimiento de la pila (si no está en el entorno de producción).
 *
 * @param { Error } err - el objeto de error que se debe manejar.
 * @param { Object } req - el objeto de solicitud.
 * @param { Object } res - el objeto de respuesta.
 * @param { Function } next - la siguiente función de middleware en el ciclo de solicitud-respuesta de la aplicación.
 */
export const errorHandler = ( err, req, res, next ) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status( statusCode );
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};