/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './tests',
  
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    launchOptions: {
      args: ["--use-gl=angle", "--use-angle=swiftshader"],
    },
  },

  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    timeout: 120000,
    reuseExistingServer: true,
  },
};

module.exports = config;