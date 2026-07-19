import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:4000';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: BASE_URL
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: 'npm start',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000
  }
});