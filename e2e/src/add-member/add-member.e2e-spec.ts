import { AddMemberPage } from './add-member.po';
import { LoginPage } from '../login/login.po';
import { browser, protractor } from 'protractor';

describe('Add Member: ', () => {
  let page: AddMemberPage;
  const loginPage = new LoginPage();

  beforeEach(() => {
    page = new AddMemberPage();
  });

  it('should have the title `Add Member`', () => {
    loginPage.loginSuccessfully();
    browser.waitForAngular();
    page.navigateTo('members-list');
    page.getFabButton().click();
    loginPage.waitFor('mp-add-member ion-title');
    expect(page.getHeaderTitle()).toBe('Add Member');
  });

  it('should have invite button at the right top', () => {
    page.getInputList().get(0).click();
    page.getInputList().get(0).sendKeys('test' + (Math.floor(Math.random() * 1000) + '@team'));
    expect(page.getInviteButton().getText()).toBe('INVITE');
  });

  it('should have one input field in the list', () => {
    expect(page.getInputList().count()).toBe(1);
  });

  it('should add one item in the list when click add button', () => {
    page.getAddButton().click();
    expect(page.getInputList().count()).toBe(2);
  });

  it('should remove one item in the list when click delete button', () => {
    page.getDeleteButton().click();
    expect(page.getInputList().count()).toBe(1);
  });

  it('should come back to members-list page when invite successfully sent', () => {
    page.getInputList().get(0).click();
    page.getInputList().get(0).sendKeys('.center');
    page.getInviteButton().click();
    loginPage.waitFor('app-members-list ion-title');
    expect(page.getMembersListHeaderTitle()).toBe('Members');
    loginPage.logout();
  });
});
