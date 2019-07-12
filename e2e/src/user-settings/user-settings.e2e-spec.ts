import { UserSettingsPage } from './user-settings.po';
import { LoginPage } from '../login/login.po';
import { browser } from 'protractor';

describe('User Settings: ', () => {
  let page: UserSettingsPage;
  const loginPage = new LoginPage();

  beforeEach(() => {
    page = new UserSettingsPage();
  });

  it('should have the title `Settings`', () => {
    loginPage.loginSuccessfully();
    browser.waitForAngular();
    page.navigateTo('/user-settings');
    loginPage.waitFor('mp-user-settings ion-title');
    expect(page.getHeaderTitle()).toBe('Settings');
  });

  it('should already fill first name, last name and mobile', () => {
    expect(page.getAllInput().get(0).getAttribute('value')).toBe('Indiana');
    expect(page.getAllInput().get(1).getAttribute('value')).toBe('Jones');
    expect(page.getAllInput().get(2).getAttribute('value')).toBe('079 123 45 78');
  });

  it('should have the buttons `DELETE MY ACCOUNT`, `CHANGE PASSWORD` and `SAVE`', () => {
    expect(page.getAllButton().get(0).getText()).toBe('DELETE MY ACCOUNT');
    expect(page.getAllButton().get(1).getText()).toBe('CHANGE PASSWORD');
    expect(page.getAllButton().get(2).getText()).toBe('SAVE');
  });

  it('should open the alert and have title `Delete my account`', () => {
    page.getAllButton().get(0).click();
    expect(page.getAlertHeading().getText()).toBe('Delete my account');
    expect(page.getAlertCancelButton().getText()).toBe('CANCEL');
    page.getAlertCancelButton().click();
  });

  it('should open change password modal and have title `Change Password`', () => {
    page.getAllButton().get(1).click();
    loginPage.waitFor('mp-change-password ion-title');
    expect(page.getChangePasswordText()).toBe('Change Password');
  });

  it('should have two input fields `password` and `new password` and both fields should be empty', () => {
    expect(page.getPasswordAndNewPasswordInputFields().count()).toBe(2);
    expect(page.getPasswordAndNewPasswordInputFields().get(0).getAttribute('value')).toBe('');
    expect(page.getPasswordAndNewPasswordInputFields().get(1).getAttribute('value')).toBe('');
  });

  it('should fill `password` and `new password` and save button should be enabled', () => {
    page.getPasswordAndNewPasswordInputFields().get(0).sendKeys('password1');
    page.getPasswordAndNewPasswordInputFields().get(1).sendKeys('password2');
    expect(page.getSaveButton().isEnabled()).toBeTruthy();
    page.navigateTo('/user-settings');
    loginPage.logout();
  });
});
