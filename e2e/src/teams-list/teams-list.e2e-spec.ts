import { TeamsListPage } from './teams-list.po';
import { LoginPage } from '../login/login.po';
import { browser, protractor } from 'protractor';

describe('Teams List: ', () => {
  let page: TeamsListPage;
  const loginPage = new LoginPage();

  beforeEach(() => {
    page = new TeamsListPage();
  });

  it('should have the title `Teams`', () => {
    loginPage.loginSuccessfully();
    browser.waitForAngular();
    page.navigateTo('teams-list');
    loginPage.waitFor('mp-teams-list ion-title');
    expect(page.getHeaderTitle()).toBe('Teams');
  });

  it('should have the team list to greater then 1', () => {
    loginPage.waitFor('mp-teams-list ion-list');
    expect(page.getTeamsList().count()).toBeGreaterThan(1);
  });

  it('should click on first item popover icon and render popover list length 3 or greater then 3', () => {
    page.getTeamListPopoverIcon().click();
    loginPage.waitFor('mp-teams-list-popover ion-item');
    expect(page.getTeamListPopoverList().count()).toBeGreaterThanOrEqual(3);
  });

  it('should click on `edit roles` in the popover list alert render', () => {
    page.getTeamListPopoverList().get(0).click();
    loginPage.waitFor('.alert-wrapper');
    expect(page.getAlertPopup().isPresent()).toBeTruthy();
  });

  it('should click on `cancel` button popup close', () => {
    loginPage.waitFor('.alert-button-group button');
    page.getAlertPopupList().get(0).click();
    expect(page.getAlertPopup().isPresent()).toBeFalsy();
    page.navigateTo('teams-list');
    loginPage.logout();
  });
});
