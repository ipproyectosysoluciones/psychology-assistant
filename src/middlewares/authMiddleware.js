import jwt from 'jsonwebtoken';
import User from '../models/user.js';

/**
 * @module protect
 * @description Función de middleware para proteger las rutas verificando el token de autorización en los encabezados de la solicitud.
 * Si el token es válido, lo decodifica, recupera la información del usuario y la adjunta al objeto de la solicitud.
 * Si el token no es válido o no está presente, envía una respuesta de estado 401 con un mensaje apropiado.
 *
 * @param { Object } req - el objeto de la solicitud.
 * @param { Object } res - el objeto de la respuesta.
 * @param { Function } next - la siguiente función de middleware en la pila.
 * @returns { void }
 */
export const protect = async ( req, res, next ) => {
  let token;

  if ( req.headers.authorization && req.headers.authorization.startsWith( 'Bearer' )) {
    try {
      token = req.headers.authorization.split(' ')[ 1 ];
      const decoded = jwt.verify( token, process.env.JWT_SECRET );
      req.user = await User.findById( decoded.id ).select( '-password' );
      next();
    } catch ( error ) {
      res.status( 401 ).json({ message: 'Not authorized, token failed' });
    }
  }

  if ( !token ) {
    res.status( 401 ).json({ message: 'Not authorized, no token' });
  }
};