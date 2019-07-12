import { LoginPage } from './login.po';
import { browser } from 'protractor';

describe('Login: ', () => {
  let page: LoginPage;

  beforeEach(() => {
    page = new LoginPage();
  });

  it('should have the title `Login`', () => {
    page.navigateTo('/login');
    expect(page.getHeaderTitle()).toBe('Login');
  });

  it('should empty email and password fields when component is initialize', () => {
    expect(page.getAllInputfields().get(0).getText()).toBe('');
    expect(page.getAllInputfields().get(1).getText()).toBe('');
    expect(page.getAllInputfields().count()).toBe(2);
    browser.waitForAngular();
  });

  it('should enable Login button when email is valid', () => {
    page.getAllInputfields().get(0).click();
    page.getAllInputfields().get(0).sendKeys('test' + (Math.floor(Math.random() * 1000) + '@team'));
    page.getAllInputfields().get(1).click(); // to remove the focus from the email input
    browser.waitForAngular();
    expect(page.getLoginButton().isEnabled()).toBeTruthy();
  });

  it('should fill valid email and password and navigate to events list page', () => {
    page.loginSuccessfully();
    browser.waitForAngular();
    expect(browser.getCurrentUrl()).toContain('events-list');
    page.logout();
  });

  it('should fill valid email and password and navigate to members list page', () => {
    page.loginSuccessfully();
    browser.waitForAngular();
    page.navigateTo('members-list');
    browser.waitForAngular();
    expect(browser.getCurrentUrl()).toContain('members-list');
    page.logout();
  });

  it('should navigate to login page upon logout', () => {
    page.loginSuccessfully();
    page.logout();
    expect(browser.getCurrentUrl()).toContain('login');
  });
});
