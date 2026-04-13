/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        diagnostics: {
          ignoreCodes: [151002],
        },
        tsconfig: {
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          esModuleInterop: true,
        },
      },
    ],
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(otplib|@otplib|@scure|base32-decode|base32-encode)/)',
  ],
  moduleNameMapper: {
    '^otplib$': '<rootDir>/src/__tests__/mock-otplib.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.ts',
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/__tests__/**/*.test.js',
    '<rootDir>/src/**/*.test.js',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.js',
    '!src/__tests__/**',
    '!src/config/database.ts',
    '!src/config/database.js',
    '!src/server.ts',
    '!src/server.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 55,
      functions: 55,
      lines: 55,
      statements: 55,
    },
  },
  verbose: true,
  forceExit: false,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testTimeout: 10000,
};
