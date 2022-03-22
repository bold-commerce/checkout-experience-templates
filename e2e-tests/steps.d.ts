/// <reference types='codeceptjs' />
type loginPage = typeof import('./pages/loginPage');
type homePage = typeof import('./pages/homePage');
type CustomHelper = import('./CustomHelper');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any, loginPage: loginPage, homePage: homePage }
  interface Methods extends Playwright, CustomHelper {}
  interface I extends WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
