import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/a11y-matrix',
  fullyParallel: true,
  retries: 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [['list'], ['json', { outputFile: 'a11y-matrix-results/playwright-report.json' }]],
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/a11y-matrix/generate-report.ts',

  use: {
    trace: 'off',
    screenshot: 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
