import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/test/server.integration.test.ts'],
    env: {
      NODE_ENV: 'test',
    },
    // Don't use the setup file with MSW for server tests
  },
});