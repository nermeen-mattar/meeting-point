import { MemberDetailsPage } from './member-details.po';
import { LoginPage } from '../login/login.po';
import { browser } from 'protractor';
import { MembersListPage } from '../members-list/members-list.po';

describe('Member Details: ', () => {
  let page: MemberDetailsPage;
  const loginPage = new LoginPage();
  const membersListPage = new MembersListPage();

  beforeEach(() => {
    page = new MemberDetailsPage();
  });

  it('should have the title `Member Details`', () => {
    loginPage.loginSuccessfully();
    browser.waitForAngular();
    page.navigateTo('members-list');
    loginPage.waitFor('app-members-list ion-item-sliding');
    membersListPage.getMembersList().get(0).click();
    loginPage.waitFor('mp-member-details ion-title');
    expect(page.getHeaderTitle()).toBe('Member Details');
  });

  it('should have the heading `Roles:`, `Phone:` and `Mail:` on main page', () => {
    loginPage.waitFor('mp-member-details ion-text');
    expect(page.getHeadingList().get(1).getText()).toBe('Roles:');
    expect(page.getHeadingList().get(2).getText()).toBe('Phone:');
    expect(page.getHeadingList().get(3).getText()).toBe('Mail:');
  });

  it('should click on popover icon and have 3 options in popover', () => {
    loginPage.waitFor('mp-member-details .member-details__main-details__popover-icon');
    page.getPopoverIcon().click();
    loginPage.waitFor('mp-member-details-popover ion-text');
    expect(page.getPopoverList().count()).toBe(3);
  });

  it('should toggle member activation when click on activation in popover list', () => {
    let action = '';
    page.getPopoverList().get(1).getText().then(actionText => {
      if (actionText === 'Deactivate') {
        action = 'Active';
      } else {
        action = 'Deactivate';
      }
      loginPage.waitFor('mp-member-details-popover ion-text');
      page.getPopoverList().get(1).click();
      loginPage.waitFor('mp-member-details .member-details__main-details__popover-icon');
      page.getPopoverIcon().click();
      loginPage.waitFor('mp-member-details-popover ion-text');
      expect(page.getPopoverList().get(1).getText()).toBe(action);
    });
  });

  it('should click on edit roles and alert popup render', () => {
    page.getPopoverList().get(0).click();
    loginPage.waitFor('.alert-wrapper');
    expect(page.getAlertPopup().isPresent()).toBeTruthy();
  });

  it('should close popup when cancel button is clicked', () => {
    loginPage.waitFor('.alert-button-group button');
    page.getPopupCancelButton().get(0).click();
    expect(page.getAlertPopup().isPresent()).toBeFalsy();
    page.navigateTo('members-list');
    loginPage.logout();
  });
});
