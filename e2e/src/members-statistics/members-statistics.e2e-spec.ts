import { MembersStatistics } from './members-statistics.po';
import { LoginPage } from '../login/login.po';
import { browser, protractor } from 'protractor';

describe('Members Statistic: ', () => {
  let page: MembersStatistics;
  const loginPage = new LoginPage();

  beforeEach(() => {
    page = new MembersStatistics();
  });

  it('should have the title `Members Statistics`', () => {
    loginPage.loginSuccessfully('test+admin-1@meeting-point', 'password1');
    browser.waitForAngular();
    page.navigateTo('members-statistics');
    loginPage.waitFor('mp-members-statistics ion-title');
    expect(page.getHeaderTitle()).toBe('Members Statistics');
  });

  it('should have `From Date Input` and its value aleady filled', () => {
    expect(page.getFromAndToDateInput().get(0).isEnabled()).toBeTruthy();
    expect(page.getFromAndToDateInput().get(1).isEnabled()).toBeTruthy();
    expect(page.getFromAndToDateInput().get(0).getAttribute('value')).toContain('2018-12-31');
  });

  it('should select a first team', () => {
    page.getTeamSelectDropDown().click();
    page.getTeamNameList().get(0).getText().then(team => {
      page.getTeamNameList().get(0).click();
      expect(page.getTeamNameList().get(0).getText()).toBe(team);
      page.getModalOkButton().click();
    });
  });

  it('should show the members not found message if there are no results upon searching', () => {
    page.getSearchInput().click();
    page.getSearchInput().sendKeys('saad');
    loginPage.waitFor('mp-members-statistics .app-members-statistics__not-found');
    expect(page.getNotFoundText()).toBe('The members of this team have no participations/cancelations during this period');
  });

  it('should bring results for searched members from the server', () => {
    page.getSearchInput().getAttribute('value').then(function (text) {
      const len = text.length;
      const backspaceSeries = Array(len + 1).join(protractor.Key.BACK_SPACE);
      page.getSearchInput().sendKeys(backspaceSeries);
    });
    page.getSearchInput().sendKeys('peter');
    expect(page.getMembersList().count()).toBeGreaterThanOrEqual(0);
    loginPage.logout();
  });

});
