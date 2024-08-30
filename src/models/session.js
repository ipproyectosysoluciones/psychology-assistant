import { Schema, model } from 'mongoose';

const sessionSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ip: String,
  browser: String,
}, { timestamps: true });

export default model( 'Session', sessionSchema );
