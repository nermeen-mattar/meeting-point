import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { roles } from '../core/constants/roles.constants';
import { AuthService } from '../core/services/auth.service';
import { RegisterService } from '../core/services/register.service';
import { MembersService } from '../core/services/members.service';
import { FieldValidatorsService } from '../core/services/field-validators.service';
import { TeamRegisterInfo } from '../core/models/team-register-info.model';
import { userCheckBackendResponse } from '../core/constants/user-check-backend-response.constats';
import { MemberRegisterInfo } from '../core/models/member-register-info.model';
import { RegisterUserTypes } from '../core/constants/register-user-types.constants';
import { ModalController } from '@ionic/angular';
import { TermsAndConditionsComponent } from '../shared/components/terms-and-conditions/terms-and-conditions.component';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {
  displaySpinner: boolean;
  displayMessageCard: boolean;
  registerFirstStepForm: FormGroup;
  registerSecondStepForm: FormGroup;
  currentStep: number;
  roles = roles; /* needed to declare a class property to make it available on the component html */
  registerUserTypes = RegisterUserTypes;
  userType: string;
  constructor(
    private authService: AuthService,
    private registerService: RegisterService,
    private membersService: MembersService,
    private fieldValidatorsService: FieldValidatorsService,
    private modalController: ModalController
    ) {
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.displaySpinner = false;
    this.displayMessageCard = false;
    this.currentStep = 1;
    this.createRegisterFirstStepForm();
    this.createRegisterSecondStepForm();
  }

  /**
  * @author Nermeen Mattar
  * @description uses the admin service to check if the user already exists.The response has three cases; first, the email might
  * not belong to any user. Second, the email might belong to a user who is not an admin. Third, the email might belong to an admin user.
  * For the first and the third cases the backend returns the result inside an error whereas for the second case the result is inside the
  * response.
  */
  checkUserTypeAndDisplayNextStep() {
    this.displaySpinner = true;
    return this.membersService.isMemberExist(this.registerFirstStepForm.value.email).subscribe((checkResult) => {
      this.changeFieldsBasedOnUserCheckResult(checkResult);
      this.displaySpinner = false;
      this.currentStep ++;
      }, () => {
        this.changeFieldsBasedOnUserCheckResult(this.registerFirstStepForm.value.teamName);
        this.displaySpinner = false;
        this.currentStep ++;
      });
  }

  createRegisterFirstStepForm() {
    this.registerFirstStepForm = new FormGroup({
      teamName: new FormControl('', [Validators.required, Validators.minLength(4) ]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  createRegisterSecondStepForm() {
    this.registerSecondStepForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, this.fieldValidatorsService.getValidator('validatePassword')]),
      isTeamMember: new FormControl(false),
      confirmTerms: new FormControl(false)
    });
  }

  /**
   * @author Nermeen Mattar
   * @description change the view based on the user check result.
   * Cases: 1) New user: all of the fields will be displayed. 2) Confirmed member: Only the password and isTeamMember fields should
   * be displayed 3) Non confirmed member: non of the fields should be displayed and the user should be informed to confirm his email.
   * @param {string} checkResult
   */
  changeFieldsBasedOnUserCheckResult(checkResult: string) {
    switch (checkResult) {
      case userCheckBackendResponse.newUser:
        this.userType = this.registerUserTypes.new;
        this.enableFormControls(['firstName', 'lastName', 'confirmTerms']);
        break;
      case userCheckBackendResponse.confirmedMember:
      this.userType = this.registerUserTypes.active;
      this.disableFormControls(['firstName', 'lastName', 'confirmTerms']);
        break;
      case userCheckBackendResponse.nonConfirmedMember:
        this.userType = this.registerUserTypes.pending;
        this.registerSecondStepForm.disable();
        this.displayMessageCard = true;
        break;
    }
  }

  /**
   * @author Nermeen Mattar
   * @description disables the form controls with the received names
   */
  disableFormControls(formControlsNames: string[]) {
    const formControlsLen = formControlsNames.length;
    for (let formControlIndex = 0; formControlIndex < formControlsLen; formControlIndex++) {
      this.registerSecondStepForm.get(formControlsNames[formControlIndex]).disable();
    }
  }

  /**
   * @author Nermeen Mattar
   * @description  enables the form controls with the received names
   * @param {string[]} formControlsNames
   */
  enableFormControls(formControlsNames: string[]) {
    const formControlsLen = formControlsNames.length;
    for (let formControlIndex = 0; formControlIndex < formControlsLen; formControlIndex++) {
      this.registerSecondStepForm.get(formControlsNames[formControlIndex]).enable();
    }
  }

  /**
   * @author Nermeen Mattar
   * @description calling the register function with different parameters depending on the case, as the new user is the only one who sends
   * the first and last names. Once register is successful a registration success message will be displayed to the new user and the member
   * user while the admin user will get logged in using credentials received from.
   * @param {TeamRegisterInfo} teamInfo
   * @param {MemberRegisterInfo} adminInfo
   */
  register(teamInfo: TeamRegisterInfo, adminInfo: MemberRegisterInfo) {
    if (this.userType === this.registerUserTypes.new && !this.registerSecondStepForm.controls.confirmTerms.value) {
      this.registerSecondStepForm.controls.confirmTerms.markAsDirty();
      return false;
    }
    this.displaySpinner = true;
    const newUserInfo = this.userType === this.registerUserTypes.new ? {
      firstName: adminInfo.firstName,
      lastName: adminInfo.lastName
    } : {};
    const password = adminInfo.password;
    this.authService.register({
      ...newUserInfo,
      teamName: teamInfo.teamName,
      email: teamInfo.email,
      password: password,
      isTeamMember: adminInfo.isTeamMember,
      confirmTerms: adminInfo.confirmTerms,
      timezone: moment.tz.guess()
    }).subscribe(() => {
        this.displayMessageCard = true;
        this.displaySpinner = false;
    }, () => {
      this.displaySpinner = false;
    });
  }

  /**
   * @author Nermeen Mattar
   * @description requests the backend to resend the activation mail to the email the user entered
   */
  resendConfirmationEmail() {
    this.displaySpinner = true;
    this.registerService.resendActivationMail(this.registerFirstStepForm.controls.email.value).subscribe(res => {
      this.displaySpinner = false;
    }, () => {
      this.displaySpinner = false;
    });
  }


  /**
   * @author Syed Saad Qamar
   * @description open the terms and condition modal where use can read terms and consitions
   */
  async openTermsAndConditionsModal() {
    const modal = await this.modalController.create({
      component: TermsAndConditionsComponent,
      showBackdrop: true,
       cssClass: 'terms-conditions'
    });
    return await modal.present();
  }
}
