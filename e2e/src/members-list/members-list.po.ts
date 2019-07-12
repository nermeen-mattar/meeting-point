import { browser, by, element } from 'protractor';

export class MembersListPage {
  navigateTo(destination) {
    return browser.get(destination);
  }

  getHeaderTitle() {
    return element(by.css('app-members-list ion-title')).getText();
  }

  getTeamHeading() {
    return element(by.css('app-members-list ion-label')).getText();
  }

  getTeamSelectDropDown() {
    return element(by.css('app-members-list ion-select'));
  }

  getTeamNameList() {
    return element.all(by.css('.alert-radio-group button'));
  }

  getModalOkButton() {
    return element.all(by.css('.alert-button-group button')).get(1);
  }

  getMembersList() {
    return element.all(by.css('app-members-list ion-item-sliding'));
  }

  getSearchInput() {
    return element(by.css('app-members-list .searchbar-input'));
  }

  getNotFoundText() {
    return element(by.css('app-members-list .member-list__not-found')).getText();
  }
}
