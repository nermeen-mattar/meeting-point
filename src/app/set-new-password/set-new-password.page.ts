import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { State } from '../core/models/state';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { HttpRequestsService } from '../core/services/http-requests.service';
import { FieldValidatorsService } from './../core/services/field-validators.service';
@Component({
  selector: 'mp-set-new-password',
  templateUrl: './set-new-password.page.html',
  styleUrls: ['./set-new-password.page.scss'],
})
export class SetNewPasswordPage implements OnInit {
  displaySpinner = true;
  hash: string;
  resetPasswordForm: FormGroup;
  checkResetState = State.SUCCESS;
  mail;
  State = State;
  constructor(activatedRoute: ActivatedRoute, private authService: AuthService, private router: Router,
     httpRequestsService: HttpRequestsService, private fieldValidatorsService: FieldValidatorsService) {
    const queryParams = activatedRoute.snapshot.queryParams;
    this.hash = queryParams && queryParams['h'];
      httpRequestsService.httpPost('recovery/reset-password/check', {
        hash: queryParams['h']
      }, {
        fail: 'NO_ERROR_MESSAGE'
      }).subscribe(
        res => {
          this.displaySpinner = false;
          this.checkResetState = State.SUCCESS;
          this.mail = res.mail;
          this.createResetPasswordForm();
        }, () => {
          this.displaySpinner = false;
          this.checkResetState = State.ERROR;
        });
  }

  ngOnInit() {}

  createResetPasswordForm() {

    this.resetPasswordForm = new FormGroup({
       password: new FormControl('', [Validators.required, this.fieldValidatorsService.getValidator('validatePassword')])
    });
  }

  /**
   * @author Nermeen Mattar
   * @description change the user password to the passed password.
   */
  resetPassword(resetFormValue) {
    this.displaySpinner = true;
    this.authService.resetPassword(resetFormValue.password, this.hash, this.mail).subscribe(res => {
      this.router.navigateByUrl('auth/login');
      this.displaySpinner = false;
    }, () => {
      this.displaySpinner = false;
    });
  }
}
