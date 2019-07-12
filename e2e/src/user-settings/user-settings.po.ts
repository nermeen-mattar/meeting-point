import { browser, by, element } from 'protractor';

export class UserSettingsPage {
  navigateTo(destination) {
    return browser.get(destination);
  }

  getHeaderTitle() {
    return element(by.css('mp-user-settings ion-title')).getText();
  }

  getAllButton() {
    return element.all(by.css('mp-user-settings ion-button'));
  }

  getAllInput() {
    return element.all(by.css('mp-user-settings ion-input'));
  }

  getAlertHeading() {
    return element(by.css('.alert-wrapper .alert-head h2'));
  }

  getAlertCancelButton() {
    return element.all(by.css('.alert-button-group button')).get(0);
  }

  getChangePasswordText() {
    return element(by.css('mp-change-password ion-title')).getText();
  }

  getPasswordAndNewPasswordInputFields() {
    return element.all(by.css('mp-change-password mp-new-password ion-input input'));
  }

  getSaveButton() {
    return element(by.css('mp-change-password ion-content ion-button'));
  }
}
