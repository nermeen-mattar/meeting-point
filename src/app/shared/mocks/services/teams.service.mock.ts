import { of } from 'rxjs';
import { MpTeamInfo } from 'src/app/core/models/mp-team-info.model';
import { MpCategory } from 'src/app/core/models/mp-event-category.model';

export const team: MpTeamInfo[] = [
  {
    id: 1,
    teamId: 11,
    teamName: 'team1'
  },
  {
    id: 2,
    teamId: 22,
    teamName: 'team2'
  },
  {
    id: 3,
    teamId: 33,
    teamName: 'team3'
  }
];
export const categories: Array<MpCategory> = [
  {
    name: 'category 1', id: 8
  },
  {
    name: 'category 2', id: 9
  }
];
export class TeamsServiceMock {
$teamRoles = of(null);
private _selectedTeamId = 1;

set selectedTeamId(selectedTeam: number) {
  this._selectedTeamId = selectedTeam;
}

get selectedTeamId(): number {
  return this._selectedTeamId;
}

get userTeams() {
  return [{
    teamId: 1,
    teamName: 'test'
  }];
}

set userTeams(userTeams) {}

hasMemberRole() {
  return true;
}

hasAdminRole() {
  return true;
}

getTeamsTheUserIsAdminOf() {
  return [{
    teamId: 1
  }];
}

get teamRoles() {
  return {
    teamAdmins: [96, 130, 131, 68, 149, 119, 151, 120, 140, 109, 141],
    teamMembers: [96, 66, 149, 119, 120, 140]
  };
}

deleteTeam() {
  return of({});
}

addTeam() {
  return of({});
}

editTeam() {
  return of({});
}

getCategories() {
  return of(categories);
}

updateCategory() {
  return of({});
}

deleteCategory() {
  return of({});
}

removeAdminRole() {
  return of({});
}

removeMemberRole() {
  return of({});
}
}
