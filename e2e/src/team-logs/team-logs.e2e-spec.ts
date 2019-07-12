import { TeamLogsPage } from './team-logs.po';
import { LoginPage } from './../login/login.po';
import { browser } from 'protractor';

describe('Team Logs: ', () => {
  let page: TeamLogsPage;
  const loginPage = new LoginPage();

  beforeEach(() => {
    page = new TeamLogsPage();
  });

  it('should have the title `Team Logs`', () => {
    loginPage.loginSuccessfully();
    browser.waitForAngular();
    page.navigateTo('team-logs');
    loginPage.waitFor('mp-team-logs ion-title');
    expect(page.getHeaderTitle()).toBe('Team Logs');
  });

  it('should have the text `Team` on top', () => {
    expect(page.getTeamText()).toBe('Team');
  });

  it('should have `PREV` and `NEXT` buttons on the buttom', () => {
    expect(page.getPrevAndNextButtons().get(0).getText()).toBe('PREV');
    expect(page.getPrevAndNextButtons().get(1).getText()).toBe('NEXT');
    loginPage.logout();
  });
});
