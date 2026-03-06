import request from 'supertest';
import app from './src/app.js';
import User from './src/models/user.js';
import Appointment from './src/models/appointment.js';

async function testGDPR () {
  try {
    // Clean up
    await User.deleteMany({});
    await Appointment.deleteMany({});

    // Create user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'MySecurePass@2024'
    });

    // Login
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'MySecurePass@2024'
    });

    const token = loginRes.body.data.accessToken;
    console.log('✓ Usuario creado y autenticado');

    // Create appointment
    await Appointment.create({
      user: user._id,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      description: 'Test',
      status: 'scheduled'
    });

    // Test DELETE
    const res = await request(app)
      .delete('/api/users/delete-data')
      .set('Authorization', `Bearer ${token}`)
      .send({ password: 'MySecurePass@2024' });

    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(res.body, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

testGDPR();
