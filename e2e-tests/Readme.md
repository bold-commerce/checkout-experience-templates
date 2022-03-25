# Checkout e2e-tests - CodeceptJS + Playwright + TypeScript + Gherkin

This is Checkout e2e-tests project which includes CodeceptJS + Playwright + Gherkin setup using TypeScript.

## Install dependencies:

```
yarn install
```

## Contents

* `codecept.conf.js` - main configuration file
* `tests/**_test.ts` - test files
* `features/**.feature` - Gherkin feature definitions files with scenarios
* `step_definitions/steps.ts` - Gherkin steps definition files with Given/When/Then functions
* `pages/**Page.ts` - page objects
* `CustomHelper` - a custom helper
* `presettings.ts` - placeholder for bootstrap / teardown scripts

## Run tests

```
yarn run:tests
```

## Documentations Links

* https://codecept.io/helpers/Playwright/
* https://playwright.dev/docs/api/class-playwright/
* https://codecept.io/typescript/#getting-started
* https://codecept.io/bdd/#what-is-behavior-driven-development
