import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Base URL for all tests
    baseUrl: 'http://localhost:4200',

    // Setup fixtures and support files
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',

    // Timeouts
    defaultCommandTimeout: 5000,
    requestTimeout: 5000,
    responseTimeout: 10000,

    // Screenshots and videos
    screenshotOnRunFailure: true,
    video: true,
    videoCompression: 32,
    videoUploadOnPasses: false,

    // Browser settings
    browserStartArgs: {
      '--no-sandbox': undefined,
      '--disable-dev-shm-usage': undefined,
    },

    // Test isolation
    testIsolation: true,

    // API mocking
    setupNodeEvents(on, config) {
      // Example: Plugin for database seeding before tests
      // on('task', {
      //   seedDatabase(data) {
      //     // Seed test data
      //     return null;
      //   },
      // });

      return config;
    },

    // Environment variables
    env: {
      API_URL: 'http://localhost:5000/api',
      TEST_USER_EMAIL: 'test@example.com',
      TEST_USER_PASSWORD: 'password123',
    },

    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,

    // Reporters
    reporter: 'spec',
    reporterOptions: {
      mochaFile: './cypress/results/junit.xml',
      toConsole: true,
    },
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },
});
