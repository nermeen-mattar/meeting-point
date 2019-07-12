import { MembersListPage } from './members-list.po';
import { LoginPage } from './../login/login.po';
import { browser, protractor } from 'protractor';

describe('Members List: ', () => {
  let page: MembersListPage;
  const loginPage = new LoginPage();

  beforeEach(() => {
    page = new MembersListPage();
  });

  it('should have the title `Members`', () => {
    loginPage.loginSuccessfully();
    browser.waitForAngular();
    page.navigateTo('members-list');
    loginPage.waitFor('app-members-list ion-title');
    expect(page.getHeaderTitle()).toBe('Members');
  });

  it('should have the label `Team` at the top of the page', () => {
    expect(page.getTeamHeading()).toBe('Team');
  });

  it('should select a `meeting-point Dev Team`', () => {
    page.getTeamSelectDropDown().click();
    page.getTeamNameList().get(2).click();
    expect(page.getTeamNameList().get(2).getText()).toBe('meeting-point Dev Team');
    page.getModalOkButton().click();
  });

  it('should get members data and have more than one item in the list', () => {
    expect(page.getMembersList().count()).toBeGreaterThan(1);
  });

  it('should show the members not found message if there are no results upon searching', () => {
    page.getSearchInput().click();
    page.getSearchInput().sendKeys('saad');
    loginPage.waitFor('app-members-list .member-list__not-found');
    expect(page.getNotFoundText()).toBe('This team has no members yet');
  });

  it('should bring results for searched members from the server', () => {
    page.getSearchInput().getAttribute('value').then(function (text) {
      const len = text.length;
      const backspaceSeries = Array(len + 1).join(protractor.Key.BACK_SPACE);
      page.getSearchInput().sendKeys(backspaceSeries);
    });
    page.getSearchInput().sendKeys('peter');
    loginPage.waitFor('app-members-list ion-item-sliding');
    expect(page.getMembersList().count()).toBe(3);
    loginPage.logout();
  });
});
