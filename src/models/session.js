import { Schema, model } from 'mongoose';

const sessionSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  appointment: {
    type: Schema.Types.ObjectId,
    ref: 'Appointment',
    required: false
  },
  loginTime: {
    type: Date,
    default: Date.now
  },
  logoutTime: Date,
  ipAddress: String,
  userAgent: String,
  isActive: {
    type: Boolean,
    default: true
  },
  duration: Number, // en segundos
  notes: String
}, { timestamps: true });

// Índices
sessionSchema.index({ user: 1, loginTime: -1 });
sessionSchema.index({ isActive: 1 });
sessionSchema.index({ createdAt: -1 });

// Método para cerrar sesión
sessionSchema.methods.logout = function () {
  this.logoutTime = new Date();
  this.isActive = false;
  this.duration = Math.floor((this.logoutTime - this.loginTime) / 1000);
  return this.save();
};

export const Session = model('Session', sessionSchema);
