import { MpClientSideTeamRoles } from './../../../core/models/mp-client-side-team-roles.model';
export class UserServiceMock {

  constructor() {}

  get username(): string {
    return 'ahsan';
  }
  set username(username: string) {}

  get teamRoles(): MpClientSideTeamRoles {
    return {
      teamAdmins: [1],
      teamMembers: [1]
    };
  }

  set teamRoles(teamRoles) {}

  clearLoggedInUserInfo () {}
}
