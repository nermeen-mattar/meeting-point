
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { MpTeamInfo } from '../models/mp-team-info.model';
import { MpClientSideTeamRoles } from '../models/mp-client-side-team-roles.model';
import { MpServerSideTeamRoles } from '../models/mp-server-side-team-roles.model';
import { HttpRequestsService } from './http-requests.service';
import { MpCategory } from '../models/mp-event-category.model';
import { TeamLogItem } from '../models/team-log';
import { MpDateAdapter } from './mp-date-adapter';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private _userTeams: MpTeamInfo[];
  private _selectedTeamId: number;
  private _teamRoles: BehaviorSubject < MpClientSideTeamRoles > = new BehaviorSubject(null);
  $teamRoles: Observable < MpClientSideTeamRoles > = this._teamRoles.asObservable();
  constructor(
    private httpRequestService: HttpRequestsService,
    private dateAdapterService: MpDateAdapter
  ) {
    this.selectedTeamId = JSON.parse(localStorage.getItem('selectedTeamId'));
    this.userTeams = JSON.parse(localStorage.getItem('userTeams'));
    this.teamRoles = JSON.parse(localStorage.getItem('teamRoles'));
  }

  /**
   * @author Nermeen Mattar
   * @description prepares an array for teams list and an array for teams roles then calls a function to fill the two arrays. The function
   * is called twice; first to push the teams the user is admin of and second to push the teams the user is member of. The result of the two
   * calls is combined.
   * @param {MpServerSideTeamRoles} backendTeamRoles
   */
  initTeamRolesAndTeamsList(backendTeamRoles: MpServerSideTeamRoles) {
    const teamsList: MpTeamInfo[] = [];
    const teamRoles: MpClientSideTeamRoles = {};

    this.pushTeamRolesAndTeamsList(backendTeamRoles['teamAdmins'], 'teamAdmins', teamRoles, teamsList);
    this.pushTeamRolesAndTeamsList(backendTeamRoles['teamMembers'], 'teamMembers', teamRoles, teamsList);

    this.teamRoles = teamRoles;
    this.userTeams = teamsList;
  }

  /**
   * @author Nermeen Mattar
   * @description pushes teams to the teams list to combine the teams that the user is admin of with the teams that the user is member of.
   * Then it sets the teamRoles to the backendTeamRoles after mapping it to the clientSideTeamRoles. Mapping happens by changing teams
   * property from array of MpTeamInfo objects to array of numbers.
   *
   *
   * @param {MpTeamInfo[]} backendTeams
   * @param {string} teamRoleName
   * @param {MpClientSideTeamRoles} teamRoles
   * @param {MpTeamInfo[]} teamsList
   */
  pushTeamRolesAndTeamsList(backendTeams: MpTeamInfo[], teamRoleName: string, teamRoles: MpClientSideTeamRoles, teamsList: MpTeamInfo[]) {
    teamRoles[teamRoleName] = [];
    // const normalizedTeamRole = teamRoleName === 'teamAdmins' ? roles.admin : roles.member;
    const backendTeamsLen = backendTeams.length;
    for (let teamIndex = 0; teamIndex < backendTeamsLen; teamIndex++) {
      const teamToUpdate = teamsList.findIndex(team => team.teamId === backendTeams[teamIndex].teamId);
      const teamData = {
        teamId: backendTeams[teamIndex].teamId,
        teamName: backendTeams[teamIndex].teamName,
        adminId: null,
        memberId: null
      };
      if (teamToUpdate > -1) {
        if (teamRoleName === 'teamAdmins') {
          teamData.memberId = teamsList[teamToUpdate].memberId;
          teamData.adminId = backendTeams[teamIndex].id;
        } else {
          teamData.adminId = teamsList[teamToUpdate].adminId;
          teamData.memberId = backendTeams[teamIndex].id;
        }
        teamsList[teamToUpdate] = teamData;
      } else {
        if (teamRoleName === 'teamAdmins') {
          teamData.adminId = backendTeams[teamIndex].id;
        } else {
          teamData.memberId = backendTeams[teamIndex].id;
        }
        teamsList.push(teamData);
      }
      teamRoles[teamRoleName].push(backendTeams[teamIndex].teamId);
    }
  }


  getTeamLogs(teamId, userTimeZone): Observable<Array<TeamLogItem>> {
    return this.httpRequestService.httpGet(`statistics/particip/byteam/${teamId}`)
      .pipe(
        map(logs => {
          logs.map(log => {
            // tslint:disable-next-line:max-line-length
            log.startTime = `${this.dateAdapterService.getFormattedDate(log.startTime, userTimeZone)} ${this.dateAdapterService.getFormattedTime(log.startTime, userTimeZone)}`;
            // tslint:disable-next-line:max-line-length
            log.updatedAt = `${this.dateAdapterService.getFormattedDate(log.updatedAt, userTimeZone)} ${this.dateAdapterService.getFormattedTime(log.updatedAt, userTimeZone)}`;
            return log;
          });
          return logs;
        })
      );
  }


  /**
   * @author Nermeen Mattar
   * @description returns the team roles for the logged in user
   * @readonly
   * @type {MpClientSideTeamRoles}
   */
  get teamRoles(): MpClientSideTeamRoles {
    return this._teamRoles.getValue();
  }

  /**
   * @author Nermeen Mattar
   * @description sets the team roles in a private variable then it either sets them in the localstorage or remove them from the
   *  localstorage
   * @param {teamRoles} MpClientSideTeamRoles
   */
  set teamRoles(teamRoles: MpClientSideTeamRoles) {
    this._teamRoles.next(teamRoles);
    if (teamRoles) {
      localStorage.setItem('teamRoles', JSON.stringify(teamRoles));
    } else {
      localStorage.removeItem('teamRoles');
    }
  }

  /**
   * @author Nermeen Mattar
   * @description returns the team roles for the logged in user
   * @returns {MpTeamInfo[]}
   */

  get userTeams(): MpTeamInfo[] {
    return this._userTeams;
  }

  /**
   * @author Nermeen Mattar
   * @description each time we set new user teams we initialize the selected team by the first one
   */
  set userTeams(userTeams: MpTeamInfo[]) {
    this._userTeams = userTeams;
    if (userTeams) {
      localStorage.setItem('userTeams', JSON.stringify(userTeams));
      if (!this.selectedTeamId && this._userTeams[0]) {
        this.selectedTeamId = this._userTeams[0].teamId; // sets an initial value to the select input
      }
    } else {
      this.selectedTeamId = undefined;
      localStorage.removeItem('userTeams');
    }
  }

  /**
   * @author Nermeen Mattar
   * @description returns team the user has selected from the list of team he/she is admin/member of.
   */
  get selectedTeamId(): number {
    return this._selectedTeamId;
  }

  /**
   * @author Nermeen Mattar
   * @description sets the selected team in a private variable and in the localstorage based on the user selection from the list of teams
   * he/she is admin/member of.
   */
  set selectedTeamId(selectedTeamId: number) {
    this._selectedTeamId = selectedTeamId;
    if (selectedTeamId) {
      localStorage.setItem('selectedTeamId', JSON.stringify(selectedTeamId));
    } else {
      localStorage.removeItem('selectedTeamId');
    }
  }

  /**
   * @author Nermeen Mattar
   * @description filters the teams list to get only the teams that the user is admin of and sets this value in the teamsTheUserIsAdminOf.
   */
  getTeamsTheUserIsAdminOf() {
    return this.userTeams.filter(team => this.teamRoles.teamAdmins.includes(team.teamId));
  }

  /**
  * @author Syed Saad Qamar @given by Nermeen on PR#45
  * @description filters the teams list to get only the teams that the user is member of and sets this value in the teamsTheUserIsMemberOf.
  */
  getTeamsTheUserIsMemberOf() {
    return this.userTeams.filter(team => this.teamRoles.teamMembers.includes(team.teamId));
  }

  /**
   * @author Nermeen Mattar
   * @description attemps to update the team name for the team with the passed teamId using the httpPut function from httpRequestsSevrice.
   * Upon successful request the team name for the modifier team will be changed in team roles.
   * @param {string} newTeamName
   * @param {number} teamId
   */
  changeTeamName(newTeamName: string, teamId: number) {
    this.httpRequestService.httpPut('teams/' + teamId + '/change_team_name', {
      teamName: newTeamName
    }, {
      success: 'TEAM.TEAM_NAME_CHANGING_SUCCESS',
      failDefault: 'TEAM.TEAM_NAME_CHANGING_FAIL'
    }).subscribe(res => {
      this.userTeams.filter(team => team.teamId === teamId)[0].teamName = newTeamName;
      localStorage.setItem('userTeams', JSON.stringify(this.userTeams));
    });
  }

  /**
   * @author Ahsan Ayaz
   * @desc Sends the add team server call and creates a team
   * @param teamName - the name of the team to be created
   */
  addTeam(teamName: string): Observable <any> {
    return this.httpRequestService.httpPost('teams', {
      teamName
    }, {
      success: 'TEAM.TEAM_CREATED_SUCCESS',
      failDefault: 'TEAM.TEAM_CREATED_FAILURE'
    }).pipe(map(team => {
      /* Following is commented as a new token is received which updates the userTeams
      this.userTeams.push({teamName: team.name, teamId: team.id});
      localStorage.setItem('userTeams', JSON.stringify(this.userTeams));
      */
     }));
  }

  /**
   * @author Syed Saad Qamar
   * @desc Sends the edit team server call and update a team
   * @param team - the team to be updated
   */
  editTeam(team: MpTeamInfo): Observable <any> {
    return this.httpRequestService.httpPut(`teams/${team.teamId}`, {
      id: team.teamId,
      name: team.teamName,
      cancelWithReason: team.cancelWithReason,
      sendReminder: true
    }, {
      success: 'TEAM.TEAM_UPDATED_SUCCESS',
      failDefault: 'TEAM.TEAM_UPDATED_FAILURE'
    });
  }

  /**
   * @author Nermeen Mattar
   * @description check wether the user with the passed id has a member role
   * @param {number} teamId
   * @returns {boolean}
   */
  hasMemberRole(teamId ?: number): boolean {
    if (teamId) {
      return this.teamRoles.teamMembers.includes(teamId);
    } else {
      return Boolean(this.teamRoles.teamMembers.length); /* may move this line to the user service */
    }
  }

  /**
   * @author Nermeen Mattar
   * @description check wether the user with the passed id has an admin role
   * @param {number} teamId
   * @returns {boolean}
   */
  hasAdminRole(teamId ?: number): boolean {
    if (teamId) {
      return this.teamRoles.teamAdmins.includes(teamId);
    } else {
      if (this.teamRoles.teamAdmins) {
        return Boolean(this.teamRoles.teamAdmins.length);
      }
      return false;
    }
  }

  /**
   * @author Nermeen Mattar
   * @description adds a member role (if not already exist) to the user roles for the team with the passed teamId
   * @param {number} teamId
   */
  addMemberRole(teamId: number) {
    if (!this.teamRoles.teamMembers.includes(teamId)) { /* may generalize this to be addRole(rolename) */
      this.teamRoles.teamMembers.push(teamId);
      localStorage.setItem('teamRoles', JSON.stringify(this.teamRoles));
    }
  }

  /**
   * @author Nermeen Mattar
   * @description removes the member role from the user roles for the team with the passed teamId
   * @param {number} teamId
   */
  removeMemberRole(teamId: number) {
    this.teamRoles.teamMembers = this.teamRoles.teamMembers.filter(currTeamId => currTeamId !== teamId);
    this.teamRoles = this.teamRoles;
    if (this.teamRoles.teamAdmins.findIndex(currTeamId => currTeamId === teamId) === -1) {
      this.userTeams = this.userTeams.filter(userTeam => userTeam.teamId !== teamId);
      this.selectedTeamId = this.teamRoles.teamMembers[0];
    }
  }

  /**
   * @author Nermeen Mattar
   * @description removes the admin role from the user roles for the team with the passed teamId
   * @param {number} teamId
   */
  removeAdminRole(teamId: number) {
    this.teamRoles.teamAdmins = this.teamRoles.teamAdmins.filter(currTeamId => currTeamId !== teamId);
    this.teamRoles = this.teamRoles;
    if (this.teamRoles.teamMembers.findIndex(currTeamId => currTeamId === teamId) === -1) {
      this.userTeams = this.userTeams.filter(userTeam => userTeam.teamId !== teamId);
      this.selectedTeamId = this.teamRoles.teamAdmins[0];
    }
  }

  /**
   * @author Nermeen Mattar
   * @description deletes the team with the passed teamId
   * @param {number} teamId
   */
  deleteTeam(teamId: number): Observable < any > {
    return this.httpRequestService.httpDelete(`teams/${teamId}`, {
      success: 'TEAM.TEAM_DELETING_SUCCESS',
      failDefault: 'TEAM.TEAM_DELETING_ERROR'
    }).pipe(map(res => {
      this.removeAdminRole(teamId);
      this.removeMemberRole(teamId);
      this.userTeams = this.userTeams.filter(userTeam => userTeam.teamId !== teamId);
      if (teamId === this.selectedTeamId && this.userTeams.length) {
        this.selectedTeamId = this.userTeams[0].teamId;
      }
      return res;
    }));
  }

  /**
   * @author Nermeen Mattar
   * @description resets the class variables
   */
  resetData() {
    this.userTeams = null;
    this.teamRoles = null;
  }

/**
  * @author Syed Saad Qamar @copied from web
  * @description sends a get request to the server to receive the categories with the team id
  * @param {number} teamId
  * @returns {Observable <any>}
  */
 getCategories(teamId: number): Observable < any > {
  return this.httpRequestService.httpGet(
    `category/byteam/${teamId}`, {
      failDefault: 'TEAM.TEAM_GETTING_CATEGORY_FAIL'
    });
  }

/**
  * @author Syed Saad Qamar @copied from web
  * @description sends a put request to the server to update category name
  * @param {MpCategory} category
  * @returns {Observable <any>}
  */
   updateCategory(category: MpCategory): Observable < any > {
    return this.httpRequestService.httpPut('category', category, {
      success: 'TEAM.CATEGORY.CATEGORY_UPDATED_SUCCESS',
      failDefault: 'TEAM.CATEGORY.CATEGORY_UPDATED_FAILURE'
    });
  }

  /**
    * @author Syed Saad Qamar @copied from web
    * @description deletes the category with the passed categoryId
    * @param {number} categoryId
    */
   deleteCategory(categoryId: number): Observable < any > {
    return this.httpRequestService.httpDelete(`category/${categoryId}`, {
      success: 'TEAM.CATEGORY.CATEGORY_DELETING_SUCCESS',
      failDefault: 'TEAM.CATEGORY.CATEGORY_DELETING_FAIL'
    });
  }

    /**
    * @author Syed Saad Qamar
    * @description get team details using team id
    * @param {number} teamId
    */
   getTeam(teamId: number): Observable < any > {
    return this.httpRequestService.httpGet(`teams/${teamId }`);
  }
}
