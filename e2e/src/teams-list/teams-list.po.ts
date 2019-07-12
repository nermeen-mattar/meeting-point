import { browser, by, element } from 'protractor';

export class TeamsListPage {
  navigateTo(destination) {
    return browser.get(destination);
  }

  getHeaderTitle() {
    return element(by.css('mp-teams-list ion-title')).getText();
  }

  getTeamsList() {
    return element.all(by.css('mp-teams-list ion-list'));
  }

  getTeamListPopoverIcon() {
    return element.all(by.css('mp-teams-list .team-list__popover')).get(0);
  }

  getTeamListPopoverList() {
    return element.all(by.css('mp-teams-list-popover ion-item'));
  }

  getAlertPopup() {
    return element(by.css('.alert-wrapper'));
  }

  getAlertPopupList() {
    return element.all(by.css('.alert-button-group button'));
  }
}
