import qrcode from 'qrcode';

/**
 * @module generateQR
 * @description Genera una imagen de código QR a partir del texto proporcionado.
 *
 * @param { string } text - el texto que se codificará en el código QR.
 * @returns { Promise<string> } - una URL de datos que representa la imagen del código QR generada.
 * @throws { Error } - si falla el proceso de generación del código QR.
 */
const generateQR = async ( text ) => {
  try {
    const qrCode = await qrcode.toDataURL( text );
    return qrCode;
  } catch ( error ) {
    throw new Error( 'QR Code generation failed' );
  }
};

export default { generateQR };
