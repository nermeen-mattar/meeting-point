import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AlertController, PopoverController, NavParams, ModalController } from '@ionic/angular';
import { MembersService } from 'src/app/core/services/members.service';
import { MpMember } from 'src/app/core/models/mp-member.model';
import { LocalizedAlertService } from 'src/app/core/services/localized-alert.service';

@Component({
  selector: 'mp-member-details-popover',
  templateUrl: './member-details-popover.component.html',
  styleUrls: ['./member-details-popover.component.scss']
})
export class MemberDetailsPopoverComponent implements OnInit {
  memberDetails: MpMember;
  isAdmin: boolean;
  constructor(
    public alertController: AlertController,
    public popoverController: PopoverController,
    public navParams: NavParams,
    public membersService: MembersService,
    public modalController: ModalController,
    public localizedAlertService: LocalizedAlertService) { }

  ngOnInit() {
    this.memberDetails = this.navParams.data.member_details;
    this.isAdmin = this.navParams.data.member_details.isAdmin;
  }

  async editRoles() {
    const confirmationAlert = {
      header: 'TEAM.CHOOSE_ROLES',
      cssClass: 'badge',
      inputs: [
        {
          name: 'member',
          type: 'checkbox',
          label: 'Member',
          value: 'meber',
          disabled: true,
          checked: true,
        },

        {
          name: 'admin',
          type: 'checkbox',
          label: 'Admin',
          value: 'admin',
          checked: this.isAdmin,
          handler: (data) => {
            this.isAdmin = data.checked;
          }
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Save',
          handler: () => {
            if (this.isAdmin) {
              this.makeAdmin();
            } else {
              this.removeAdmin();
            }
          }
        }
      ]
    };
    this.localizedAlertService.displayLocalizedAlert(confirmationAlert);
  }

  /**
   * @author Syed Saad Qamar
   * @description delete the member from the database by using members service deleteMember function to passing member id.
   */
  deleteMemberFormTeam() {
    this.popoverController.dismiss();
    this.membersService.deleteMemberRole(this.memberDetails.id).subscribe(() => {
      this.modalController.dismiss();
    });
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @description changes the member activtaion status by first toggling current activation status then sending this data to the members
   * service. Once the data is sent to the backend successfuly, the subscription callback changes the data on the client side accordingaly.
   * @param {MpMember} member
   */
  changeMemberActivationStatus() {
    const updatedFlag: number = this.memberDetails.active ? 0 : 1;
    this.membersService.changeMemberActivationStatus({
      flag: updatedFlag,
      /* backend expects number */
      teamId: this.memberDetails.team.id,
      teamMemberId: this.memberDetails.id
    }).subscribe(() => {
      this.memberDetails.active = !this.memberDetails.active;
      this.popoverController.dismiss(this.memberDetails);
    });
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @desc Makes the specified user an admin using the member id
   */
  makeAdmin() {
    this.membersService.makeAdmin(this.memberDetails.member.id, this.memberDetails.team.id).subscribe(() => {
      this.memberDetails.isAdmin = !this.memberDetails.isAdmin;
      this.popoverController.dismiss(this.memberDetails);
    }, () => {
      this.popoverController.dismiss();
      this.isAdmin = !this.isAdmin;
    });
  }

  /**
   * @author Syed Saad Qamar
   * @desc Removes the specified user an admin using the id
   */
  removeAdmin() {
    this.membersService.removeAdminRole(this.memberDetails['teamAdminId']).subscribe(() => {
      this.memberDetails.isAdmin = !this.memberDetails.isAdmin;
      this.popoverController.dismiss(this.memberDetails);
    }, () => {
      this.popoverController.dismiss();
      this.isAdmin = !this.isAdmin;
    });
  }
}
