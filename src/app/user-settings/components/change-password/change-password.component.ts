import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FieldValidatorsService } from 'src/app/core/services/field-validators.service';
import { MembersService } from 'src/app/core/services/members.service';
import { LoginStatusService } from 'src/app/core/services/login-status.service';
import { LocalizedAlertService } from 'src/app/core/services/localized-alert.service';

@Component({
  selector: 'mp-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordGroup: FormGroup;
  displaySpinner = false;
  constructor(
    public modalController: ModalController,
    public fieldValidatorsService: FieldValidatorsService,
    public membersService: MembersService,
    public loginStatusService: LoginStatusService,
    public localizedAlertService: LocalizedAlertService,
  ) { }

  ngOnInit() {
    this.createChangePasswordForm();
  }

  /**
   * @author Syed Saad Qamar
   * @description close the model when invite send or user press back button
   */
  closeModal () {
    this.modalController.dismiss();
  }

  /**
  * @author Syed Saad Qamar
  * @description when user click on ok button one action will be performed the account delete.
  */
 deleteUserAccount() {
  const confirmationAlert = {
    header: 'USER.CONFIRM_DELETING_ACCOUNT_HEADER',
    message: 'USER.CONFIRM_DELETING_ACCOUNT_BODY',
    buttons: [
      {
        text: 'CANCEL',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
        }
      }, {
        text: 'OK',
        handler: () => {
          this.displaySpinner = true;
          this.membersService.deleteMyAccount().subscribe(() => {
            this.displaySpinner = false;
            this.loginStatusService.logout();
            this.closeModal();
          }, () => {
            this.displaySpinner = false;
          });
        }
      }
    ]
  };
  this.localizedAlertService.displayLocalizedAlert(confirmationAlert);
}

  createChangePasswordForm() {
    this.changePasswordGroup = new FormGroup({
      password: new FormControl('', Validators.required),
      newPassword: new FormControl('', [Validators.required, this.fieldValidatorsService.getValidator('validatePassword')])
    });
  }

  /**
  * @author Syed Saad Qamar @copied from web
  * @description sends the new password the user provided as an attempt to change the password
  */
  changePassword() {
    this.displaySpinner = true;
    this.membersService.changePassword(this.changePasswordGroup.value).subscribe(() => {
      this.displaySpinner = false;
      this.loginStatusService.logout();
      this.closeModal();
    }, () => {
      this.displaySpinner = false;
    });
  }
}
