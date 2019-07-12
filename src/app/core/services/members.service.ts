import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { MpActivationStatusInfo } from './../models/mp-activation-status-info.model';
import { MpMember } from '../models/mp-member.model';
import { HttpRequestsService } from './../../core/services/http-requests.service';
import { map } from 'rxjs/internal/operators/map';
import { catchError, filter } from 'rxjs/operators';
import { throwError, forkJoin } from 'rxjs';
import { MpNestedMember } from '../models/mp-nested-member';


@Injectable({
  providedIn: 'root'
})

export class MembersService {
  defaultFilterProps = ['firstName', 'lastName', 'mail', 'mobile', 'fullName'];
  constructor(private httpRequestService: HttpRequestsService) {}

  /**
   * @author Nermeen Mattar
   * @description Uses the httpRequestsSevrice to send a post request to the backend to check whether the received email belongs to an
   * already existed member. Note that an object of type UserMessages is being sent with an empty fail property to disable defulat error.
   * @param emailObj
   */
  isMemberExist(email: string): Observable<any> {
    return this.httpRequestService.httpPost('members/check', {
      email: email
    }, {
        fail: 'NO_ERROR_MESSAGE'
      });
  }

  /**
   * @author Nermeen Mattar
   * @description sends a get request to the server to get the list of members for a specific user and team
   * @param {number} teamId
   * @param {boolean} isPast
   * @returns {Observable < any >}
   */
  getMembers(teamId: number): Observable < Array<MpMember> > { // Member[] there are other info!
    return this.httpRequestService.httpGet(
      `teammembers/byteamid/${teamId}`,
      {
        failDefault: 'MEMBER.MEMBER_GETTING_FAIL'
      }
    ).pipe(
      map(members => this.processMembers(members))
    );
  }

  /**
   * @author Ahsan Ayaz
   * @desc Processes the member objects
   */
  processMembers(members: Array<MpMember>) {
    return members.map(memberObj => {
      if (!memberObj.member.firstName && !memberObj.member.lastName) {
        memberObj.member.fullName = null;
      } else {
        memberObj.member.fullName = `${memberObj.member.firstName || ''} ${memberObj.member.lastName || ''}`;
      }
      return memberObj;
    });
  }

  /**
   * @author Nermeen Mattar
   * @description sends a request to the server to delete a specific member
   * @param {number} memberId
   * @returns {Observable <any>}
   */
  deleteMemberRole(memberId: number): Observable<any> {
    return this.httpRequestService.httpDelete(
      `teammembers/${memberId}`, {
        success: 'TEAM.TEAM_REMOVE_MEMBER_ROLE_SUCCESS',
        failDefault: 'TEAM.TEAM_REMOVE_MEMBER_ROLE_FAIL'
      });
  }

  /**
   * @author Ahsan Ayaz
   * @desc Converts a member into an admin using memberId and TeamId
   * @param {number} memberId the member id of the user
   * @param {number} teamId the team ID member is a part of
   */
  makeAdmin(memberId: number, teamId: number): Observable<any> {
    return this.httpRequestService.httpPost(
      'teamadmins', {
        memberId,
        teamId
      }, {
        success: 'MEMBER.MEMBER_MAKE_ADMIN_SUCCESS',
        fail: 'MEMBER.MEMBER_MAKE_ADMIN_FAILURE'
      }
    );
  }

  /**
   * @author Syed Saad Qamar
   * @desc Removes a member  admin using memberId and TeamId
   * @param {number} teamAdmin the teamAdmin id of the user
   */
  removeAdminRole(teamAdminId: number): Observable<any> {
    return this.httpRequestService.httpDelete(
      `teamadmins/${teamAdminId}`, {
        success: 'TEAM.TEAM_REMOVE_ADMIN_ROLE_SUCCESS',
        failDefault: 'TEAM.TEAM_REMOVE_ADMIN_ROLE_FAIL'
      }
    );
  }

  /**
   * @author Ahsan Ayaz
   * @desc Filters the members list based on the following properties.
   * firstName', 'lastName'
   * @param memberObj - the member object in the array to test
   * @param filterStr - the filter string to match against
   */
  membersFilter(properties = this.defaultFilterProps, ) {
    return (memberObj: MpMember | MpNestedMember, filterStr: string) => {
      filterStr = filterStr.toString().toLowerCase();
      const member = memberObj;
      const match = properties.find((key) => {
        return member[key] && member[key].toString().toLowerCase().indexOf(filterStr) !== -1;
      });
      return match !== undefined;
    };
  }

  /**
   * @author Nermeen Mattar
   * @desc an admin changes a member pariticipations
   * @param {boolean} isParticipated
   * @param {number} memberId the member id of the user
   * @param {number} eventId the event id
  */
  changeMemberParticipation(isParticipated: boolean, eventId: number, memberId: number): Observable<any> {
    const participationText = isParticipated ? 'participate' : 'cancel';
    const toggleSuccessMessage = isParticipated ? 'MEMBER.MEMBER_MOVED_TO_PARTICIPATION' : 'MEMBER.MEMBER_MOVED_TO_CANCELATION';
    return this.httpRequestService.httpPost(
      'teammembers/' + memberId + '/particips', {
        eventId: eventId,
        participationText: participationText,
      }, {
        success: toggleSuccessMessage,
        fail: 'EVENT.EVENT_CHANGING_PARTICIPATION_FAIL'
      }
    );
  }

  /**
   * @author Nermeen Mattar
   * @description
   * @param {MpActivationStatusInfo} statusInfo
   * @returns
   * @memberof MembersService
   */
  changeMemberActivationStatus(activationStatusInfo: MpActivationStatusInfo) {
    const changeStatusSuccessMessage = activationStatusInfo.flag ? 'MEMBER.MEMBER_ACTIVATE_SUCCESS' : 'MEMBER.MEMBER_DEACTIVATE_SUCCESS';
    return this.httpRequestService.httpPut(
      `teammembers`, activationStatusInfo, {
        success: changeStatusSuccessMessage,
        failDefault: 'MEMBER.MEMBER_CHANGING_ACTIVATION_STATUS_FAIL'
      });
  }

  /** Following are functions needed for member form **/

  /**
   * @author Nermeen Mattar
   * @description sends a get request to the server to receive the member with the received id
   * @param {number} memberId
   * @returns {Observable <any>}
   */
  getMember(memberId: number): Observable<any> {
    return this.httpRequestService.httpGet(
      `members/${memberId}`,
      {
        failDefault: 'MEMBER.MEMBER_GETTING_FAIL'
      });
  }

  /**
   * @author Nermeen Mattar
   * @description sends a post request to the server to create a new member
   * @param {teamId} number
   * @param {MpMember} member
   * @returns {Observable <any>}
   */
  createMember(teamId: number, members: Array<{email: string, firstName: string, lastName: string}>): Observable<any> {
  return forkJoin([
    ...members.map((member) => {
      return this.httpRequestService.httpPost(
        'members', { teamId: teamId, ...member }
      );
    })
  ])
    .pipe(
      map((res: any) => {
        this.httpRequestService.defaultSuccessHandler({}, {
          success: 'MEMBER.MEMBER_CREATING_SUCCESS'
        });
      return res.data ? res.data : res;
    }),
    catchError(err => {
      this.httpRequestService.defaultErrorHandler(err, {
        failDefault: 'MEMBER.MEMBER_CREATING_FAIL'
      });
      return throwError(err);
    }));
  }

  /**
   * @author Nermeen Mattar
   * @description sends a get request to the server to update the member with the received id
   * @param {number} memberId
   * @param {MpMember} member
   * @returns {Observable <any>}
   */
  updateMember(memberId: number, member: MpMember): Observable<any> {
    return this.httpRequestService.httpPut(
      `members/${memberId}`, member, {
        success: 'MEMBER.MEMBER_UPDATING_SUCCESS',
        failDefault: 'MEMBER.MEMBER_UPDATING_FAIL'
      });
  }

  /**
   * @author Nermeen Mattar
   * @description Upon changing the language for a logged in user a request is sent to update member language
   * @param {string} langCode
   */
  updateMemberLanguage(langCode: string) {
    this.httpRequestService.httpPost(
      `members/language`, { lang: langCode }, {
        fail: 'NO_ERROR_MESSAGE'
      }).subscribe(res => res);
  }

  /**
   * @author Nermeen Mattar
   * @description sends the member's firstname, last name, password, and activation hash to the server
   * to activate the member in the first login
   * @returns {Observable <any>}
   */
  activateMember(memberAtivationInfo): Observable<any> {
    return this.httpRequestService.httpPost('activation/member', memberAtivationInfo);
  }

  /**
   * @author Tobias Trusch
   * @description sends the activation hash to the server
   * to add this member to the inviter team
   * @returns {Observable <any>}
   */
  acceptInvitation(memberAtivationInfo): Observable<any> {
    return this.httpRequestService.httpPost('activation/accept-invitation', memberAtivationInfo);
  }

  resendInvitation(teamMemberId: number) {
    return this.httpRequestService.httpGet('teammembers/' + teamMemberId + '/resent-invitation', {
      success: 'MEMBER.MEMBER_INVITATION_RESEND_SUCCESS',
      failDefault: 'MEMBER.MEMBER_INVITATION_RESEND_FAIL'
    });
  }

  /**
   * @author Tobias Trusch
   * @description Checks if a user needs to set password (first login) or needs to only accept the invitation
   * @returns {Observable <any>}
   */
  activateCheckMember(memberAtivationInfo): Observable<any> {
    return this.httpRequestService.httpPost('activation/check', memberAtivationInfo);
  }

  /**
   * @author Nermeen Mattar
   * @description attemps to update the member password Using the httpPut function from httpRequestsSevrice.
   * @param {any} oldAndNewPasswords
   */
  changePassword(oldAndNewPasswords): Observable<any> {
    return this.httpRequestService.httpPut('members/change_password', oldAndNewPasswords, {
      success: 'MEMBER.MEMBER_PASSWORD_CHANGING_SUCCESS',
      failDefault: 'MEMBER.MEMBER_PASSWORD_CHANGING_FAIL'
    });
  }


  /**
   * @author Nermeen Mattar
   * @description sets the teams' reminders for logged in user
   * @param {any} teamsReminders
   */
  setReminders(teamsReminders) {
    return this.httpRequestService.httpPut('members/reminders', teamsReminders, {
      fail: 'NO_ERROR_MESSAGE'
    }).subscribe(res => res);
  }

  /**
   * @author Nermeen Mattar
   * @description gets the list of teams' reminders for logged in user
   */
  getReminders(): Observable<any> {
    return this.httpRequestService.httpGet('members/reminders', {
      fail: 'NO_ERROR_MESSAGE'
    });
  }

  /**
   * @author Nermeen Mattar
   * @description attemps to delete the account of the logged in user.
   */
  deleteMyAccount() {
    return this.httpRequestService.httpDelete('members', {
      success: 'USER.USER_DELETING_SUCCESS',
      failDefault: 'USER.USER_DELETING_FAIL'
    });
  }

  /**
   * @author Syed Saad Qamar
   * @description send the value of sendReminder for a specific team
   * @param {any} sendReminder
   * @param {number} teamMemberId
   * @returns {Observable <any>}
   */
  setReminderForEvents(teamsToggleData): Observable<any> {
    return this.httpRequestService.httpPut('members/update_send_reminder', teamsToggleData, {
      success: 'NOTIFICATIONS.REMINDER_NOTIFICATION_SUCCESS',
      failDefault: 'NOTIFICATIONS.REMINDER_NOTIFICATION_FAIL'
    });
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @description sends a get request to the server to receive the member with the received id
   * @param {number} memberId
   * @returns {Observable <any>}
   */
  getTeamMembers(): Observable<any> {
    return this.httpRequestService.httpGet(
      `teammembers`, // teammembers
      {
        failDefault: 'MEMBER.MEMBER_GETTING_FAIL'
      });
  }
}
