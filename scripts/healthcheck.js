#!/usr/bin/env node

/**
 * Health check script for Docker
 * Tests database connectivity and basic API functionality
 */

import mongoose from 'mongoose';
import environment from '../src/config/environment.js';

async function healthCheck() {
  try {
    // Test database connection
    await mongoose.connect(environment.MONGO_URI);
    console.log('✅ Database connection successful');

    // Test basic query
    const db = mongoose.connection.db;
    const collections = await db.collections();
    console.log(`✅ Found ${collections.length} collections`);

    // Close connection
    await mongoose.disconnect();

    console.log('✅ Health check passed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
}

healthCheck();
