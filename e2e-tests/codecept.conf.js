require('ts-node/register')
const { setHeadlessWhen } = require('@codeceptjs/configure');
const { bootstrap } = require('./presettings.ts');

// turn on headless mode when running with HEADLESS=true environment variable
// HEADLESS=true npx codecept run
setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: './tests/**_test.ts',
  output: './output',
  helpers: {
    Playwright: {
      url: 'https://github.com',
      show: false,
      windowSize: '1200x900',
      browser: 'chromium'
    },
    CustomHelper: {
      require: './CustomHelper.ts'
    }
  },
  bootstrap,
  include: {
    loginPage: './pages/loginPage.ts',
    homePage: './pages/homePage.ts'
  },
  name: 'checkout-e2e-tests',
  plugins: {
    screenshotOnFail: {
      enabled: true
    },
    retryFailedStep: {
      enabled: true
    }
  },
  gherkin: {
    features: './features/*.feature',
    steps: ['./step_definitions/steps.ts']
  }
}
