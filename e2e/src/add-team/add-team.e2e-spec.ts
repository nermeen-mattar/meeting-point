import { AddTeamPage } from './add-team.po';
import { LoginPage } from '../login/login.po';
import { browser, protractor } from 'protractor';

describe('Add Team: ', () => {
  let page: AddTeamPage;
  const loginPage = new LoginPage();

  beforeEach(() => {
    page = new AddTeamPage();
  });

  it('should have the title `Create Team`', () => {
    loginPage.loginSuccessfully();
    browser.waitForAngular();
    page.navigateTo('teams-list');
    page.getFabButton().click();
    loginPage.waitFor('mp-manage-team ion-title');
    expect(page.getHeaderTitle()).toBe('Create Team');
  });

  it('should have `Team Name` at the left top', () => {
    expect(page.getAllHeading().get(0).getText()).toBe('Team Name');
  });

  it('should have `Add` button enabled when input field is empty and clean', () => {
    expect(page.getTeamNameInput().getText()).toBe('');
    expect(page.getMangeTeamButton().isEnabled()).toBe(true);
  });

  it('should close the modal when enter team name and click on add button', () => {
    page.getTeamNameInput().click();
    page.getTeamNameInput().sendKeys('Test');
    page.getMangeTeamButton().click();
    loginPage.waitFor('mp-teams-list ion-title');
    expect(page.getTeamListHeaderTitle()).toBe('Teams');
    loginPage.logout();
  });

});
