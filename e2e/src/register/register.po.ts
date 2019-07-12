import { browser, by, element, protractor } from 'protractor';

export class RegisterPage {

  navigateTo(destination) {
    return browser.get(destination);
  }

  getHeaderTitle() {
    return element(by.css('app-register ion-title')).getText();
  }

  getAllInputfields() {
    return element.all(by.css('app-register ion-input input'));
  }

  getNextButton() {
    return element(by.css('app-register #nextBtn'));
  }

  getBackButton() {
    return element(by.css('app-register #backBtn'));
  }

  getOkButton() {
    return element(by.css('app-register #okBtn'));
  }

  getRegisterButton() {
    return element(by.css('app-register #registerBtn'));
  }

  getCheckboxes() {
    return element.all(by.css('app-register ion-checkbox'));
  }

  fillInputsByOrder(values) {
    values.forEach((value, index) => {
      this.clearInput(this.getAllInputfields().get(index));
      this.getAllInputfields().get(index).click();
      this.getAllInputfields().get(index).sendKeys(value);
    });
    this.getAllInputfields().get(0).click();
  }

  clearInput(elem) {
    elem.getAttribute('value').then(function (text) {
      const len = text.length;
      const backspaceSeries = Array(len + 1).join(protractor.Key.BACK_SPACE);
      elem.sendKeys(backspaceSeries);
    });
  }

  getCheckboxText() {
    return element.all(by.css('app-register ion-label'));
  }

  waitFor(selector, timeout = 20 * 1000) {
    return browser.wait(() => element(by.css(selector)).isPresent(), timeout);
  }
}
