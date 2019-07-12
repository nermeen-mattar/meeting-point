import { Observable } from 'rxjs/internal/Observable';
import { of, throwError } from 'rxjs';
import { MpMember } from '../../../core/models/mp-member.model';

export const membersData = [{
  id: 1,
  firstName: 'test',
  acceptInvitation: true,
  entryDate: '',
  lastName: 'tester',
  isAdmin: true,
  email: 'test@gmail.com',
  mail: '',
  mobile: 123,
  allowReminders: true,
  active: true,
  name: 'test',
  new: true,
  member: {
    id: 1,
    new: true,
    email: 'test@gmail.com',
    firstName: 'test',
    lang: 'en',
    lastName: 'tester',
    fullName: 'test member 1',
    mail: '',
    name: 'test',
    mailConfirmation: true,
    mobile: '',
    teamAdmin: true,
    teamMembers: true
  },
  team: {
    id: 1
  }
},
{
  id: 2,
  firstName: 'test',
  acceptInvitation: true,
  entryDate: '',
  lastName: 'tester',
  isAdmin: true,
  email: 'test@gmail.com',
  mail: '',
  mobile: 123,
  allowReminders: true,
  active: true,
  name: 'test',
  new: true,
  member: {
    id: 1,
    new: true,
    email: 'test@gmail.com',
    firstName: 'test',
    lang: 'en',
    lastName: 'test',
    fullName: 'test member 2',
    mail: '',
    name: 'test',
    mailConfirmation: true,
    mobile: '',
    teamAdmin: true,
    teamMembers: true
  },
  team: {
    id: 2
  }
}
];
export class MembersServiceMock {
  makeAdminError = false;
  removeAdminError = false;
  constructor() {}

  getMembers(): Observable < MpMember [] > {
    return of(membersData);
  }
  getMember(memberId: string): Observable < any > {
    return of(membersData[0]);
  }
  createMember(teamId: number, member: MpMember ): Observable < any > { // Member [] there are other info!
    return of({});
  }
  updateMember(memberId: string, teamId: number, member: MpMember ): Observable < any > {
    return of({});
  }

  deleteMember() {
    return of({});
  }

  membersFilter() {
    return () => {
      return [];
    };
  }

  changeMemberActivationStatus() {
    return of({});
  }

  makeAdmin() {
    if (this.makeAdminError) {
      return throwError('err');
    }
    return of({});
  }

  removeAdmin() {
    if (this.removeAdminError) {
      return throwError('err');
    }
    return of({});
  }

  changePassword() {
    return of({});
  }

  processMembers() {}

  deleteMemberRole() {
    return of({});
  }

  removeAdminRole() {
    return of({});
  }
}

