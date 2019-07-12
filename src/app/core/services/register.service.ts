import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { HttpRequestsService } from './http-requests.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor( private httpRequestsService: HttpRequestsService) { }

  /**
   * @author Nermeen Mattar
   * @description attempts to resend activation mail
   * @param {string} email
   */
  resendActivationMail(email: string): Observable <any> {
    return this.httpRequestsService.httpPost('activation/resent', {email: email},
    { success: 'REGISTER.ACTIVATION_MAIL_RESEND_SUCCESS'}); // {fail: 'NO_ERROR_MESSAGE'}
  }

  sendMemberInvitation() {
    // https://dev.meeting-point/invitation?h=BnbWFpbC5jb207NDU2OzI3NQ==dGVhbS0jQlYGVyMze30isLjtoYXNoEZ1IXY0RXYt5WZl1mcl52OwIDN

  }

}
