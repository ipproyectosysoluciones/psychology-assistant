import User from '../models/user.js';

/**
 * @module getUserProfile
 * @description Recupera el perfil de usuario en función del ID de usuario del objeto de solicitud.
 * Filtra el campo de contraseña de los datos de usuario antes de enviar la respuesta.
 * Si se produce un error durante el proceso, envía un estado 500 con un mensaje de "Error de servidor".
 *
 * @param { Object } req - el objeto de solicitud que contiene el ID de usuario en req.user._id
 * @param { Object } res - el objeto de respuesta para enviar los datos del perfil de usuario o el mensaje de error
 * @returns { Object } - los datos del perfil de usuario o un mensaje de error del servidor en formato JSON
 */
export const getUserProfile = async ( req, res ) => {
  try {
    const user = await User.findById( req.user._id ).select( '-password' );
    res.json( user );
  } catch ( error ) {
    res.status( 500 ).json({ message: 'Server error' });
  }
};

/**
 * Actualiza el perfil del usuario que ha iniciado sesión actualmente.
 *
 * @param { Object } req - el objeto de la solicitud.
 * @param { Object } res - el objeto de la respuesta.
 * @returns { Object } - El perfil de usuario actualizado en formato JSON.
 * @throws { Object } - Si se produce un error en el servidor, devuelve un objeto JSON con una clave 'message' establecida en 'Server error'.
 */
export const updateUserProfile = async ( req, res ) => {
  const { name, email } = req.body;
  try {
    const user = await User.findById( req.user._id );

    user.name = name || user.name;
    user.email = email || user.email;
    
    const updatedUser = await user.save();
    res.json( updatedUser );
  } catch ( error ) {
    res.status( 500 ).json({ message: 'Server error' });
  }
};
