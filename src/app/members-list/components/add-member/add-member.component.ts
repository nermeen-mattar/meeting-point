import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MembersService } from 'src/app/core/services/members.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'mp-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {

  addEmailForm: FormGroup;
  teamId: number;
  displaySpinner = false;
  emails: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    public membersService: MembersService,
    private navParams: NavParams
  ) {
    this.addEmailForm = this.formBuilder.group({
      emails: this.formBuilder.array([
        this.getEmailFormGroup()
      ])
    });
  }

  ngOnInit() {
    this.teamId = this.navParams.get('teamId');
  }

  /**
   * @author Syed Saad Qamar
   * @description create a group and control with the name of email
   */
  getEmailFormGroup() {
    return this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  /**
   * @author Syed Saad Qamar
   * @description add new group and control in the form group
   */
  addEmailField() {
    this.emails = this.addEmailForm.get('emails') as FormArray;
    this.emails.push(this.getEmailFormGroup());
  }

  /**
   * @author Syed Saad Qamar
   * @description remove group and control from the form group
   */
  removeEmailField(index) {
    this.addEmailForm.get('emails')['controls'].splice(index, 1);
    this.emails.value.splice(index, 1);
  }

  /**
   * @author Syed Saad Qamar copied from web
   * @description takes the user changes map properties to match the ones required by the backend then either updates or creates an member
   *  upon successfully saving the member.
   */
  addMembersToTeam() {
    this.displaySpinner = true;
    const formArray = this.addEmailForm.get('emails')['controls'];
    const data = [];
    formArray.map((control) => {
      data.push({ email: control.value.email });
    });
    this.membersService.createMember(this.teamId, data).subscribe(
      () => {
        this.modalController.dismiss(true);
        this.displaySpinner = false;
      }, () => {
        this.displaySpinner = false;
      }
    );
  }

  isValidForm() {
    for (let i = 0; i < this.addEmailForm.get('emails')['controls'].length; i++) {
      if (this.addEmailForm.get('emails')['controls'][i].controls.email.invalid) {
        return true;
      }
    }
  }

  /**
   * @author Syed Saad Qamar
   * @description close the model when invite send or user press back button
   */
  closeModal() {
    this.modalController.dismiss(false);
  }

}
