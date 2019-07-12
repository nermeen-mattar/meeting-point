import { browser, by, element } from 'protractor';

export class MemberStatisticsDetailsPage {
  navigateTo(destination) {
    return browser.get(destination);
  }

  getHeaderTitle() {
    return element(by.css('mp-member-statistics-details ion-title')).getText();
  }

  getMembersStatisticsList() {
    return element.all(by.css('mp-members-statistics .app-members-statistics__list__participation'));
  }

  getAllHeadings() {
    return element.all(by.css('mp-member-statistics-details ion-text'));
  }

  getEventList() {
    return element.all(by.css('mp-member-statistics-details ion-list'));
  }

}
