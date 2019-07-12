import { browser, by, element } from 'protractor';

export class MembersStatistics {
  navigateTo(destination) {
    return browser.get(destination);
  }

  getHeaderTitle() {
    return element(by.css('mp-members-statistics ion-title')).getText();
  }

  getFromAndToDateInput() {
    return element.all(by.css('mp-members-statistics ion-datetime'));
  }

  getTeamSelectDropDown() {
    return element(by.css('mp-members-statistics ion-select'));
  }

  getTeamNameList() {
    return element.all(by.css('.alert-radio-group button'));
  }

  getModalOkButton() {
    return element.all(by.css('.alert-button-group button')).get(1);
  }

  getMembersList() {
    return element.all(by.css('mp-members-statistics .app-members-statistics__list'));
  }

  getSearchInput() {
    return element(by.css('mp-members-statistics .searchbar-input'));
  }

  getNotFoundText() {
    return element(by.css('mp-members-statistics .app-members-statistics__not-found')).getText();
  }
}
