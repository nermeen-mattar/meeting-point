import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MpMember } from 'src/app/core/models/mp-member.model';
import { FieldValidatorsService } from 'src/app/core/services/field-validators.service';
import { MembersService } from 'src/app/core/services/members.service';
import { UserService } from 'src/app/core/services/user.service';
import { ModalController } from '@ionic/angular';
import { TimezoneSelectorComponent } from 'src/app/shared/components/timezone-selector/timezone-selector.component';
import * as moment from 'moment-timezone';

@Component({
  selector: 'mp-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  memberBasicSettingsGroup: FormGroup;
  currentMember: MpMember;
  displaySpinner: boolean;
  constructor(
    public fieldValidatorsService: FieldValidatorsService,
    public membersService: MembersService,
    public userService: UserService,
    public modalController: ModalController
  ) {
    this.createBasicSettingsForm();
  }

  ngOnInit() {
    this.displaySpinner = true;
    this.membersService.getMember(this.userService.memberId).subscribe(currentMemberInfo => {
      this.currentMember = currentMemberInfo;
      this.memberBasicSettingsGroup.patchValue(this.currentMember);
      this.displaySpinner = false;
    });
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @description creates the member form group along with its form controls and their validation rules.
   */
  createBasicSettingsForm() {
    this.memberBasicSettingsGroup = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      mobile: new FormControl(null, this.fieldValidatorsService.getValidator('number')),
      timezone: new FormControl(this.checkTimezoneCase(), Validators.required)
    });
  }

  /**
  * @author Syed Saad Qamar @copied from web
  * @description takes the user changes then calls the function to update the member settings.
  */
  saveMemberBasicInfoSettings() {
    this.displaySpinner = true;
    const updatedMemberValue = this.memberBasicSettingsGroup.value;
    Object.keys(updatedMemberValue).forEach(propertyName => {
      this.deletePropertyValueIfNotTouched(propertyName, updatedMemberValue);
    });
    updatedMemberValue.timezone = this.memberBasicSettingsGroup.value.timezone.id;
    this.membersService.updateMember(this.userService.memberId, updatedMemberValue).subscribe(res => {
      this.memberBasicSettingsGroup.markAsUntouched();
      this.currentMember = {
        ...this.currentMember,
        ...updatedMemberValue
      };
      Object.keys(updatedMemberValue).forEach(propertyName => {
        this.userService[propertyName] = updatedMemberValue[propertyName];
      });
      this.displaySpinner = false;
      this.closeModal();
    }, () => {
      this.displaySpinner = false;
    });
  }

  deletePropertyValueIfNotTouched(propertyName, updatedMemberValue) {
    if (this.memberBasicSettingsGroup.get(propertyName).untouched) {
      if (propertyName !== 'timezone') {
        delete updatedMemberValue[propertyName];
      }
    }
  }

  /**
   * @author Syed Saad Qamar
   * @description close the model when invite send or user press back button
  */
  closeModal() {
    this.modalController.dismiss();
  }

  /**
   * @author Syed Saad Qamar
   * @description open the timezone modal and get timezone from the modal
   * and set the timezone control value
   */
  async openTimezoneTypeaheadModal() {
    const modal = await this.modalController.create({
      component: TimezoneSelectorComponent,
      componentProps: {
        selectedTimeZone: this.memberBasicSettingsGroup.get('timezone').value
      }
    });
    modal.onWillDismiss().then((value) => {
      if (value.data && value.data.result) {
        this.memberBasicSettingsGroup.get('timezone').setValue(value.data.result);
      }
    });
    return await modal.present();
  }

  /**
  * @author Syed Saad Qamar @copied from web
  * @description To check that local timezone is same as saved timezone.
  */
  checkTimezoneCase() {
    const savedTimezone = this.userService.timezone;
    if (savedTimezone) {
      return { id: savedTimezone, name: '( ' + moment.tz(savedTimezone).format('Z') + ' )  ' + savedTimezone };
    } else {
      return { id: null, name: null };
    }
  }

}
