/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(otplib|@otplib|@scure|base32-decode|base32-encode)/)',
  ],
  moduleNameMapper: {
    '^otplib$': '<rootDir>/src/__tests__/mock-otplib.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.js',
    '<rootDir>/src/**/*.test.js',
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/__tests__/**',
    '!src/config/database.js',
    '!src/server.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testTimeout: 10000,
};
