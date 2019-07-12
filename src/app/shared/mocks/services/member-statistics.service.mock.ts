import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { membersData } from './members.service.mock';
import { eventData } from './events.service.mock';

export class MembersStatisticsServiceMock {
  /**
   * @author Nermeen Mattar
   * @description sends the statistics list for members of a specific team in a specific date range
   * @param {number} teamId
   * @returns {Observable < any >}
   */
  getMembersStatistics(teamId: number): Observable < any > {
    return of({
      teamMembers: membersData
    });
  }


  /**
   * @author Nermeen Mattar
   * @description gets the statistics details for a member of a specific team in a specific date range
   * @param {number} teamId
   * @param {number} memberId
   * @param {number} pageNumber
   * @param {number} pageSize
   * @returns {Observable < any >}
   */
  getMemberStatisticsDetails(action: string, memberId: number, pageNumber: number, pageSize: number): Observable < any > {
    return of({
      email: 'test@gmail.com',
      totalCount: 7,
      firstName: 'Team',
      lastName: 'Center',
      events: [eventData]
    });
  }

  getMemberByDateAndCategoryId() {
    return of({teamMembers: membersData});
  }
}
