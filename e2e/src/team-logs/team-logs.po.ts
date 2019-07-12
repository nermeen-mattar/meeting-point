import { browser, by, element } from 'protractor';

export class TeamLogsPage {
  navigateTo(destination) {
    return browser.get(destination);
  }

  getHeaderTitle() {
    return element(by.css('mp-team-logs ion-title')).getText();
  }

  getTeamText() {
    return element(by.css('mp-team-logs .team-logs__inner-header__team')).getText();
  }

  getPrevAndNextButtons() {
    return element.all(by.css('mp-team-logs ion-button'));
  }
}
