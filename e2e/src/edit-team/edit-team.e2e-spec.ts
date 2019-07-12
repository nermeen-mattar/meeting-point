import { EditTeamPage } from './edit-team.po';
import { LoginPage } from '../login/login.po';
import { browser } from 'protractor';

describe('Edit Team: ', () => {
  let page: EditTeamPage;
  const loginPage = new LoginPage();
  let teamName;
  let categoryName;

  beforeEach(() => {
    page = new EditTeamPage();
  });

  it('should have the title `Edit Team`', () => {
    loginPage.loginSuccessfully();
    browser.waitForAngular();
    page.navigateTo('teams-list');
    loginPage.waitFor('mp-teams-list ion-label');
    teamName = page.getTeamName();
    page.getTeamListPopoverIcon().click();
    page.getTeamListPopoverList().get(1).click();
    loginPage.waitFor('mp-manage-team ion-title');
    expect(page.getHeaderTitle()).toBe('Edit Team');
  });

  it('should already fill the field to team name', () => {
    expect(page.getTeamNameInput().getAttribute('value')).toBe(teamName);
  });

  it('should have Save button at the bottom', () => {
    expect(page.getMangeTeamButton().getText()).toBe('SAVE');
  });

  it('should have the heading `Categoreis`', () => {
    expect(page.getCategoriesHeading()).toMatch('Categories');
  });

  it('should have the categories list that will come from backend based on team id', () => {
    expect(page.getCategoryList().count()).toBeGreaterThan(0);
  });

  it('should edit first category when click on edit icon then update category field and click on update button', () => {
    page.getEditCategoryIcon().click();
    page.getCategoryModalInput().sendKeys('');
    categoryName =  page.getCategoryModalInput().getAttribute('value');
    page.getModalUpdateButton().click();
    loginPage.waitFor('mp-manage-team ion-list ion-label');
    expect(page.getCategoryList().get(0).getText()).toBe(categoryName);
  });

  it('should close the modal when update team name and click on add button', () => {
    page.getTeamNameInput().click();
    page.getTeamNameInput().sendKeys('');
    page.getMangeTeamButton().click();
    loginPage.waitFor('mp-teams-list ion-title');
    expect(page.getTeamListHeaderTitle()).toBe('Teams');
    loginPage.logout();
  });
});
