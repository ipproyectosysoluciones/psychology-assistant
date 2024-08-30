import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.model( 'Appointment', appointmentSchema );
