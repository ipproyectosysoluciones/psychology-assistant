import QRCode from 'qrcode';

/**
 * @module generateQR
 * @description Generates a QR code image from the provided text.
 *
 * @param { string } text - The text to encode in the QR code.
 * @returns { Promise<string> } - A data URL representing the generated QR code image.
 * @throws { Error } - If QR code generation fails.
 */
const generateQR = async (text: string): Promise<string> => {
  try {
    const qrCode = await QRCode.toDataURL(text);
    return qrCode;
  } catch {
    throw new Error('QR Code generation failed');
  }
};

export default { generateQR };
