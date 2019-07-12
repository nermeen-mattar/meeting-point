import { Injectable } from '@angular/core';

import { HttpRequestsService } from './http-requests.service';
import { LoginStatusService } from './login-status.service';
import { TeamsService } from './teams.service';
import { DecodedToken } from '../models/decoded-token.model';
import { TokenHandlerService } from './token-handler.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  /* User static properties (received from the backend) */
  private _username: string;
  private _memberId: number;
  private _firstName: string;
  private _lastName: string;
  private _mobile: number;
  private _timezone: string;
  private _localTimeZone: string;

  constructor(
    private teamsService: TeamsService,
    loginStatusService: LoginStatusService,
    httpRequestsService: HttpRequestsService,
    tokenHandlerService: TokenHandlerService
  ) {
    loginStatusService.$userLoginState.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        // resets user info upon loging out
        this.resetData();
      }
    });
    httpRequestsService.$token.subscribe( token => {
      // executed 1) upon login 2) upon token change 3) when refreshing and the user is logged in
      this.updateLoggedInUserInfo(tokenHandlerService.decodeToken(token));
    });
    this.localTimeZone = localStorage.getItem('mp-local-time-zone'); // load data on app start
  }

  /**
   * @author Nermeen Mattar
   * @description returns the username/email for the logged in user
   * @readonly
   * @type {string}
   */
  get username(): string {
    return this._username;
  }

  /**
   * @author Nermeen Mattar
   * @description sets the username/email in a private variable then it either sets it in the localstorage or remove it from the
   * localstorage
   * @param {username} string
   */
  set username(username: string) {
    this._username = username;
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }

  /**
   * @author Nermeen Mattar
   * @description returns the username/email for the logged in user
   * @readonly
   * @type {string}
   */
  get firstName(): string {
    return this._firstName;
  }

  /**
   * @author Nermeen Mattar
   * @description sets the firstName in a private variable then it either sets it in the localstorage or remove it from the
   * localstorage
   * @param {firstName} string
   */
  set firstName(firstName: string) {
    this._firstName = firstName;
    if (firstName) {
      localStorage.setItem('firstName', firstName);
    } else {
      localStorage.removeItem('firstName');
    }
  }

  /**
   * @author Nermeen Mattar
   * @description returns the username/email for the logged in user
   * @readonly
   * @type {string}
   */
  get lastName(): string {
    return this._lastName;
  }

  /**
   * @author Nermeen Mattar
   * @description sets the lastName in a private variable then it either sets it in the localstorage or remove it from the
   * localstorage
   * @param {lastName} string
   */
  set lastName(lastName: string) {
    this._lastName = lastName;
    if (lastName) {
      localStorage.setItem('lastName', lastName);
    } else {
      localStorage.removeItem('lastName');
    }
  }

  /**
   * @author Nermeen Mattar
   * @description returns the mobile for the logged in user
   * @readonly
   * @type {number}
   */
  get mobile(): number {
    return this._mobile;
  }

  /**
   * @author Nermeen Mattar
   * @description sets the mobile in a private variable then it either sets it in the localstorage or remove it from the
   * localstorage
   * @param {mobile} number
   */
  set mobile(mobile: number) {
    this._mobile = mobile;
    if (mobile) {
      localStorage.setItem('mobile', mobile.toString());
    } else {
      localStorage.removeItem('mobile');
    }
  }

  /**
   * @author Nermeen Mattar
   * @description returns the user id for the logged in user
   * @readonly
   * @type {number}
   */
  get memberId(): number {
    return this._memberId;
  }

  /**
   * @author Nermeen Mattar
   * @description sets the user id in a private variable then it either sets it in the localstorage or
   * remove it from the localstorage
   * @param {memberId} number
   */
  set memberId(memberId: number) {
    this._memberId = memberId;
    if (memberId) {
      localStorage.setItem('memberId', memberId.toString());
    } else {
      localStorage.removeItem('memberId');
    }
  }

  /**
   * @author Nermeen Mattar
   * @description sets the class properties either from the decoded token
   * (in case of logging in or updating the token) or from the localStorage
   * (in case a logged in user has reloaded the page)
   * @param {DecodedToken} decodedToken
   */
  updateLoggedInUserInfo(decodedToken?: DecodedToken) {
    if (decodedToken) {
      this.memberId = decodedToken.memberId;
      this.username = decodedToken.sub;
      this.firstName = decodedToken.firstName;
      this.lastName = decodedToken.lastName;
      this.mobile = decodedToken.mobile;
      this.timezone = decodedToken.timezone;
      this.teamsService.initTeamRolesAndTeamsList(decodedToken.teamRoles);
    } else {
      this.memberId = Number(localStorage.getItem('memberId'));
      this.username = localStorage.getItem('username');
      this.firstName = localStorage.getItem('firstName');
      this.lastName = localStorage.getItem('lastName');
      this.mobile = Number(localStorage.getItem('mobile'));
      this.timezone = localStorage.getItem('timezone');
    }
  }

  /**
   * @author Nermeen Mattar
   * @description resets the class variables
   */
  resetData() {
    this.memberId = null;
    this.username = null;
    this.firstName = null;
    this.lastName = null;
    this.mobile = null;
    this.timezone = null;
    this.localTimeZone = null;
    this.teamsService.resetData();
  }

  /**
   * @author Nermeen Mattar
   * @description returns the timezone for the logged in user
   * @readonly
   * @type {string}
   */
  get timezone(): string {
    return this._timezone;
  }

  /**
   * @author Nermeen Mattar
   * @description sets the timezone in a private variable then it either sets it in the localstorage or remove it from the
   * localstorage
   * @param {timezone} string
   */
  set timezone(timezone: string) {
    this._timezone = timezone;
    if (timezone) {
      localStorage.setItem('timezone', timezone);
    } else {
      localStorage.removeItem('timezone');
    }
  }

  /**
   * @author Nermeen Mattar
   * @description returns the timezone for the logged in user
   * @readonly
   * @type {string}
   */
  get localTimeZone(): string {
    return this._localTimeZone;
  }

  /**
   * @author Nermeen Mattar
   * @description sets the timezone in a private variable then it either sets it in the localstorage or remove it from the
   * localstorage
   * @param {timezone} string
   */
  set localTimeZone(localTimeZone: string) {
    this._localTimeZone = localTimeZone;
    if (this._localTimeZone) {
      localStorage.setItem('mp-local-time-zone', this._localTimeZone);
    } else {
      localStorage.removeItem('mp-local-time-zone');
    }
  }
}
