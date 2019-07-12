import { browser, by, element } from 'protractor';

export class EditTeamPage {
  navigateTo(destination) {
    return browser.get(destination);
  }

  getHeaderTitle() {
    return element(by.css('mp-manage-team ion-title')).getText();
  }

  getTeamName() {
    return element.all(by.css('mp-teams-list ion-label')).get(0).getText();
  }

  getTeamListPopoverIcon() {
    return element.all(by.css('mp-teams-list .team-list__popover')).get(0);
  }

  getTeamListHeaderTitle() {
    return element(by.css('mp-teams-list ion-title')).getText();
  }

  getTeamListPopoverList() {
    return element.all(by.css('mp-teams-list-popover ion-item'));
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

  getCategoriesHeading() {
    return element(by.css('mp-manage-team .manage-team__form__title')).getText();
  }

  getCategoryList() {
    return element.all(by.css('mp-manage-team ion-list ion-label'));
  }

  getEditCategoryIcon() {
    return element.all(by.css('mp-manage-team .manage-team__form__edit-category')).get(0);
  }

  getCategoryModalInput() {
    return element(by.css('.alert-wrapper .alert-input-wrapper input'));
  }

  getModalUpdateButton() {
    return element.all(by.css('.alert-wrapper .alert-button-group button')).get(0);
  }

}
