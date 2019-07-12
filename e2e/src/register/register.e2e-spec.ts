import { RegisterPage } from './register.po';
import { browser } from 'protractor';

describe('Register: ', () => {
  let page: RegisterPage;

  beforeEach(() => {
    page = new RegisterPage();
  });

  it('should have the title `Register`', () => {
    page.navigateTo('/register');
    page.waitFor('app-register ion-title');
    expect(page.getHeaderTitle()).toBe('Register');
  });

  it('should empty team name and email fields when component is initialize', () => {
    expect(page.getAllInputfields().get(0).getText()).toBe('');
    expect(page.getAllInputfields().get(1).getText()).toBe('');
    expect(page.getAllInputfields().count()).toBe(2);
    browser.waitForAngular();
  });

  it('should enable Next button when team name and email are valid', () => {
    page.fillInputsByOrder(['valid team', 'valid-email@team']);
    browser.waitForAngular();
    expect(page.getNextButton().isEnabled()).toBeTruthy();
  });

  it('should disable Next button when team name is invalid', () => {
    page.fillInputsByOrder(['inv', 'valid-email@team']);
    browser.waitForAngular();
    expect(page.getNextButton().isEnabled()).toBeTruthy();
  });

  it('should disable Next button when email is invalid', () => {
    page.fillInputsByOrder(['valid team', 'invalid-email']);
    browser.waitForAngular();
    expect(page.getNextButton().isEnabled()).toBeTruthy();
  });

  it('should fill valid email and team name and move to the next registration step', () => {
    page.fillInputsByOrder(['valid team', 'test' + (Math.floor(Math.random() * 1000) + '@team')]);
    browser.waitForAngular();
    page.getNextButton().click();
    expect(page.getBackButton().getText()).toBe('BACK');
  });

  it('should have `I confirm the term and conditions` and `I m also a member of this team` text', () => {
      expect(page.getCheckboxText().get(0).getText()).toBe('I confirm the term and conditions');
      expect(page.getCheckboxText().get(1).getText()).toBe(`I'm also a member of this team`);
  });

  it('should display first name input, last name input, password input and two checkboxes when next is clicked', () => {
    expect(page.getAllInputfields().get(0).getAttribute('placeholder')).toBe('First Name');
    expect(page.getAllInputfields().get(1).getAttribute('placeholder')).toBe('Last Name');
    expect(page.getAllInputfields().get(2).getAttribute('placeholder')).toBe('Password');
    expect(page.getAllInputfields().count()).toBe(3);
    expect(page.getCheckboxes().count()).toBe(2);
    browser.waitForAngular();
  });

  it('should enable `Register` button when fill all inputs and checked checkboxes', () => {
    page.getAllInputfields().get(0).sendKeys('test');
    page.getAllInputfields().get(1).sendKeys('test');
    page.getAllInputfields().get(2).sendKeys('test12345');
    page.getCheckboxes().get(0).click();
    page.getCheckboxes().get(1).click();
    browser.waitForAngular();
    expect(page.getRegisterButton().isEnabled()).toBeTruthy();
  });
});
