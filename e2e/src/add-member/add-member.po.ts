import { browser, by, element } from 'protractor';

export class AddMemberPage {
  navigateTo(destination) {
    return browser.get(destination);
  }

  getFabButton() {
    return element(by.css('app-members-list ion-fab-button'));
  }

  getHeaderTitle() {
    return element(by.css('mp-add-member ion-title')).getText();
  }

  getMembersListHeaderTitle() {
    return element(by.css('app-members-list ion-title')).getText();
  }

  getInviteButton() {
    return element(by.css('mp-add-member .invite'));
  }

  getInputList() {
    return element.all(by.css('mp-add-member ion-input input'));
  }

  getDeleteButton() {
    return element(by.css('mp-add-member .add-member__form__delete'));
  }

  getAddButton() {
    return element(by.css('mp-add-member .add-member__form__add'));
  }

  getNotFoundText() {
    return element(by.css('app-members-list .member-list__not-found')).getText();
  }
}
