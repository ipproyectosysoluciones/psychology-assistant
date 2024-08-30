import Appointment from '../models/appointment.js';
import qrService from '../services/qrService.js';

/**
 * @module createAppointment
 * @description Crea una nueva cita en función de la fecha y la descripción proporcionadas en el cuerpo de la solicitud.
 * Guarda la cita en la base de datos con el ID del usuario actual.
 * Genera un código QR para los detalles de la cita utilizando qrService.
 * Responde con la cita creada y su código QR correspondiente en formato JSON.
 * Si ocurre un error durante el proceso, responde con un estado 500 y un mensaje de error.
 *
 * @param { Object } req - el objeto de solicitud que contiene los detalles de la cita en el cuerpo.
 * @param { Object } res - el objeto de respuesta para enviar de vuelta la cita creada y el código QR.
 * @returns { Promise<void> } - una promesa que se resuelve una vez que se crea la cita y se envía la respuesta.
 */
export const createAppointment = async ( req, res ) => {
  const { date, description } = req.body;
  try {
    const appointment = await Appointment.create({
      user: req.user._id,
      date,
      description,
    });

    const qrCode = await qrService.generateQR( JSON.stringify( appointment ) );

    res.status( 201 ).json({ appointment, qrCode });
  } catch ( error ) {
    res.status( 500 ).json({ message: 'Server error' });
  }
};

/**
 * @module getUserAppointments
 * @description Recupera las citas del usuario conectado.
 *
 * @param {Object} req - el objeto de la solicitud.
 * @param {Object} res - el objeto de la respuesta.
 * @returns {Promise<void>} - una promesa que se resuelve con las citas del usuario o un mensaje de error.
 */
export const getUserAppointments = async ( req, res ) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id });
    res.json( appointments );
  } catch ( error ) {
    res.status( 500 ).json({ message: 'Server error' });
  }
};
