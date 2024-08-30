import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { totp } from 'otplib';
import User from '../models/user.js';
import qrService from '../services/qrService.js';

/**
 * @module register
 * @description Maneja el registro del usuario creando un nuevo usuario con el nombre, correo electrónico y contraseña proporcionados.
 * Verifica si el usuario ya existe en la base de datos. Si no es así, crea un hash de la contraseña, crea un nuevo usuario,
 * genera un token JWT para autenticación y devuelve el usuario y el token en la respuesta.
 * Si ocurre un error durante el proceso, envía una respuesta de error del servidor.
 *
 * @param { Object } req - El objeto de solicitud que contiene los datos del usuario en el cuerpo
 * @param { Object } res - El objeto de respuesta para enviar el resultado
 * @returns { Object } - Respuesta JSON con el usuario recién creado y el token de autenticación o un mensaje de error
 */
export const register = async ( req, res ) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if ( userExists ) return res.status( 400 ).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash( password, 10 );

    const user = await User.create({ name, email, password: hashedPassword });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status( 201 ).json({ user, token });
  } catch ( error ) {
    res.status( 500 ).json({ message: 'Server error' });
  }
};

/**
 * @module login
 * @description Maneja el inicio de sesión del usuario verificando las credenciales y generando un token JWT.
 *
 * @param { Object } req - el objeto de solicitud que contiene los datos ingresados por el usuario.
 * @param { Object } res - el objeto de respuesta para enviar el resultado.
 * @returns { Object } - objeto JSON con un token JWT si el inicio de sesión es exitoso o un mensaje de error.
 */
export const login = async ( req, res ) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if ( !user ) return res.status( 400 ).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if ( !isMatch ) return res.status( 400 ).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.json({ token });
  } catch ( error ) {
    res.status( 500 ).json({ message: 'Server error' });
  }
};

/**
 * @module enable2FA
 * @description Función para habilitar la autenticación de dos factores para un usuario.
 * Genera una clave secreta y una URL de autenticación OTP utilizando el correo electrónico del usuario.
 * Genera un código QR para la URL de autenticación OTP.
 * Actualiza la clave secreta de autenticación de dos factores del usuario en la base de datos.
 * Responde con el código QR generado.
 * Si ocurre un error, envía una respuesta de error del servidor.
 *
 * @param { Object } req - el objeto de la solicitud.
 * @param { Object } res - el objeto de la respuesta.
 * @returns { Object } - respuesta JSON que contiene el código QR generado o un mensaje de error del servidor.
 */
export const enable2FA = async ( req, res ) => {
  try {
    const secret = totp.generateSecret();
    const otpAuthUrl = totp.keyuri( req.user.email, 'PsychologyAssistant', secret );

    const qrCode = await qrService.generateQR( otpAuthUrl );
    
    req.user.twoFASecret = secret;
    await req.user.save();
    
    res.json({ qrCode });
  } catch ( error ) {
    res.status( 500 ).json({ message: 'Server error' });
  }
};

/**
 * @module verify2FA
 * @description Verificar el token de autenticación de dos factores proporcionado por el usuario.
 *
 * @param { Object } req - el objeto de solicitud que contiene el token del usuario.
 * @param { Object } res - el objeto de respuesta para enviar el resultado de la verificación.
 * @returns { Object } - Respuesta JSON que indica el resultado de la verificación de 2FA.
 * @throws { Object } - Respuesta JSON con un mensaje de error si la verificación falla.
 */
export const verify2FA = async ( req, res ) => {
  const { token } = req.body;
  try {
    const isValid = totp.check( token, req.user.twoFASecret );
    if ( !isValid ) return res.status( 400 ).json({ message: 'Invalid 2FA token' });

    res.json({ message: '2FA verified successfully' });
  } catch ( error ) {
    res.status( 500 ).json({ message: 'Server error' });
  }
};