import { browser, by, element } from 'protractor';

export class AddTeamPage {
  navigateTo(destination) {
    return browser.get(destination);
  }

  getFabButton() {
    return element(by.css('mp-teams-list ion-fab-button'));
  }

  getHeaderTitle() {
    return element(by.css('mp-manage-team ion-title')).getText();
  }

  getTeamListHeaderTitle() {
    return element(by.css('mp-teams-list ion-title')).getText();
  }

  getAllHeading() {
    return element.all(by.css('mp-manage-team ion-text'));
  }

  getTeamNameInput() {
    return element(by.css('mp-manage-team ion-input input'));
  }

  getCancelButton() {
    return element.all(by.css('mp-manage-team .manage-team__cancel'));
  }

  getMangeTeamButton() {
    return element(by.css('mp-manage-team .manage-team__submit'));
  }
}
