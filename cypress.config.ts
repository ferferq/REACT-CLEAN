import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    fixturesFolder: false,
    supportFile: 'src/main/test/cypress/support/index.js',
    specPattern: 'src/main/test/cypress/integration/**/*.spec.{ts,tsx}'
  },
});
