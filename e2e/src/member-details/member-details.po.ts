import { browser, by, element } from 'protractor';

export class MemberDetailsPage {
  navigateTo(destination) {
    return browser.get(destination);
  }

  getHeaderTitle() {
    return element(by.css('mp-member-details ion-title')).getText();
  }

  getTeamTextHeader() {
    return element(by.css('mp-member-details .member-details__team')).getText();
  }

  getHeadingList () {
    return element.all(by.css('mp-member-details ion-text'));
  }

  getPopoverIcon() {
    return element(by.css('mp-member-details .member-details__main-details__popover-icon'));
  }

  getPopoverList() {
    return element.all(by.css('mp-member-details-popover ion-text'));
  }

  getAlertPopup() {
    return element(by.css('.alert-wrapper'));
  }

  getPopupCancelButton() {
    return element.all(by.css('.alert-button-group button'));
  }
}
