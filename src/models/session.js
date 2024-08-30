import mongoose from 'mongoose';

const sessionSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ip: String,
  browser: String,
}, { timestamps: true });

export default mongoose.model( 'Session', sessionSchema );
