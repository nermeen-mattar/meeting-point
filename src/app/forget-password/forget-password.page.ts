import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'mp-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
  displaySpinner = false;
  displayMessageCard = false;
  constructor( private authService: AuthService) {}
  ngOnInit() {}

  /**
   * @author Nermeen Mattar
   * @description rquests to reset password for the entered email.
   * @param {string} email
   */
  requestResetPassword(email: string) {
    this.displaySpinner = true;
    this.authService.requestResetPassword(email).subscribe(res => {
      this.displayMessageCard = true;
      this.displaySpinner = false;
    }, err => {
      this.displayMessageCard = true;

      this.displaySpinner = false;
    });
  }
}
