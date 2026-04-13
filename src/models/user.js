import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';

const userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists'],
      lowercase: true,
      trim: true,
      match: [/^[\w.-]+@[\w.-]+\.\w{2,3}$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false // No incluir password en queries por defecto
    },
    role: {
      type: String,
      enum: ['user', 'psychologist', 'admin'],
      default: 'user'
    },
    twoFAEnabled: {
      type: Boolean,
      default: false
    },
    twoFASecret: {
      type: String,
      select: false
    },
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Índices
userSchema.index({ createdAt: -1 });

// Pre-save hook para hashear contraseña
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para obtener datos públicos del usuario
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.twoFASecret;
  return obj;
};

export const User = model('User', userSchema);
