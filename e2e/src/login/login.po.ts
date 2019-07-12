import { browser, by, element } from 'protractor';

export class LoginPage {

  navigateTo(destination) {
    return browser.get(destination);
  }

  getHeaderTitle() {
    return element(by.css('app-login ion-title')).getText();
  }

  getAllInputfields() {
    return element.all(by.css('app-login ion-input input'));
  }

  getLoginButton() {
    return element(by.css('app-login .login-page__submit-btn'));
  }

  loginSuccessfully(email= 'test+admin-2@meeting-point', password = 'password1') {
    this.navigateTo('/login');
    this.getAllInputfields().get(0).click();
    this.getAllInputfields().get(0).sendKeys(email);
    this.getAllInputfields().get(1).click();
    this.getAllInputfields().get(1).sendKeys(password);
    this.getLoginButton().click();
  }

  logout() {
    // element(by.css('ion-header ion-menu-button')).click(); // if browser open in mobile view this will be used
    element(by.css('ion-menu-toggle .logout')).click();
  }

  waitFor(selector, timeout = 20 * 1000) {
    return browser.wait(() => element(by.css(selector)).isPresent(), timeout);
  }
}
