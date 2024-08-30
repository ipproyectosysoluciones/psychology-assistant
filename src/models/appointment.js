import { Schema, model } from 'mongoose';

const appointmentSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
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

export default model( 'Appointment', appointmentSchema );
