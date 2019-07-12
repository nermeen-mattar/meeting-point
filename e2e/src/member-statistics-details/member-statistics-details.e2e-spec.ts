import { MemberStatisticsDetailsPage } from './member-statistics-details.po';
import { LoginPage } from '../login/login.po';
import { browser } from 'protractor';
import { MembersStatistics } from '../members-statistics/members-statistics.po';

describe('Member Stattistics Details: ', () => {
  let page: MemberStatisticsDetailsPage;
  const loginPage = new LoginPage();
  const membersStatistics = new MembersStatistics();

  beforeEach(() => {
    page = new MemberStatisticsDetailsPage();
  });

  it('should have the title `Members Statistics`', () => {
    loginPage.loginSuccessfully();
    browser.waitForAngular();
    membersStatistics.navigateTo('members-statistics');
    loginPage.waitFor('mp-members-statistics ion-title');
    expect(membersStatistics.getHeaderTitle()).toBe('Members Statistics');
  });

  it('should click first item on the list and navigate to member details page and have the title `Member Statistics Details`', () => {
    loginPage.waitFor('mp-members-statistics .app-members-statistics__list__participation');
    page.getMembersStatisticsList().get(0).click();
    loginPage.waitFor('mp-member-statistics-details ion-title');
    expect(page.getHeaderTitle()).toBe('Member Details');
  });

  it(`should have the headings "All Participations", "From", "To", "Member", "Email", "Event", "Date" and
    "Participation status" on Members Statistics Details page`, () => {
      expect(page.getAllHeadings().get(0).getText()).toBe('All Participations');
      expect(page.getAllHeadings().get(1).getText()).toBe('From');
      expect(page.getAllHeadings().get(3).getText()).toBe('To');
      expect(page.getAllHeadings().get(5).getText()).toBe('Member:');
      expect(page.getAllHeadings().get(7).getText()).toBe('Email:');
      expect(page.getAllHeadings().get(9).getText()).toBe('Event');
      expect(page.getAllHeadings().get(10).getText()).toBe('Participation status');
  });

  it('should have a list which length is greater than zero', () => {
    expect(page.getEventList().count()).toBeGreaterThan(0);
    membersStatistics.navigateTo('members-statistics');
    loginPage.logout();
  });
});
