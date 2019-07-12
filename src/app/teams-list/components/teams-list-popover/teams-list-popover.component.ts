import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, AlertController, ModalController } from '@ionic/angular';
import { TeamsService } from 'src/app/core/services/teams.service';
import { MpTeamInfo } from 'src/app/core/models/mp-team-info.model';
import { MembersService } from 'src/app/core/services/members.service';
import { UserService } from 'src/app/core/services/user.service';
import { LocalizedAlertService } from 'src/app/core/services/localized-alert.service';
import { ManageTeamComponent } from '../manage-team/manage-team.component';

@Component({
  selector: 'mp-teams-list-popover',
  templateUrl: './teams-list-popover.component.html',
  styleUrls: ['./teams-list-popover.component.scss']
})
export class TeamsListPopoverComponent implements OnInit {

  team: MpTeamInfo;
  isAdmin: boolean;
  isMember: boolean;
  isChangeAdminRole = false;
  isChangeMemberRole = false ;
  constructor(
    public popoverController: PopoverController,
    public navParams: NavParams,
    public teamsService: TeamsService,
    public alertController: AlertController,
    public membersService: MembersService,
    public userService: UserService,
    public localizedAlertService: LocalizedAlertService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.team = this.navParams.data.team;
    this.isAdmin = this.navParams.data.hasAdminRole;
    this.isMember = this.navParams.data.hasMemberRole;
  }

  async editMyRoles() {
    const confirmationAlert = {
      header: 'TEAM.CHOOSE_ROLES',
      cssClass: 'badge',
      inputs: [
        {
          name: 'member',
          type: 'checkbox',
          label: 'MEMBER.MEMBER',
          value: 'member',
          checked: this.isMember,
          handler: (data) => {
            this.isMember = data.checked;
            this.isChangeMemberRole = !this.isChangeMemberRole;
          }
        },
        {
          name: 'admin',
          type: 'checkbox',
          label: 'ADMIN.ADMIN',
          value: 'admin',
          checked: this.isAdmin,
          handler: (data) => {
            this.isAdmin = data.checked;
            this.isChangeAdminRole = !this.isChangeAdminRole;
          }
        },
      ],
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          handler: () => {
          }
        }, {
          text: 'SAVE',
          handler: () => {
            if (this.isChangeAdminRole) {
              if (this.isAdmin) {
                this.makeAdmin();
              } else {
                this.removeAdminRole();
              }
            }
            if (this.isChangeMemberRole) {
              if (this.isMember) {
                this.addTeamAdminAsMember();
              } else {
                this.leaveTeamMemberRole();
              }
            }
          }
        }
      ]
    };
    this.localizedAlertService.displayLocalizedAlert(confirmationAlert);
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @desc Makes the specified user an admin using the member id
   */
  makeAdmin() {
    this.membersService.makeAdmin(this.team.memberId, this.team.teamId).subscribe(() => {
      this.navParams.data.hasAdminRole = !this.navParams.data.hasAdminRole;
      this.closePopover();
    }, () => {
      this.isAdmin = !this.isAdmin;
      this.closePopover();
    });
  }

  /**
   * @author Syed Saad Qamar
   * @desc Removes the specified user an admin using the id
   */
  removeAdminRole() {
    this.membersService.removeAdminRole(this.team.adminId).subscribe(() => {
      this.teamsService.removeAdminRole(this.team.teamId);
      this.navParams.data.hasAdminRole = !this.navParams.data.hasAdminRole;
      this.closePopover();
    }, () => {
      this.isAdmin = !this.isAdmin;
      this.closePopover();
    });
  }

  /**
   * @author Syed Saad Qamar
   * @description when user click on ok button one action will be performed the team delete from the list or member will leave the team
   * and list will update and popup will close.
   * @param {boolean} isDeleteTeam
   */
 async confirmModel(isDeleteTeam) {
    const confirmationAlert = {
    header: 'ALERT.ALERT',
    message: isDeleteTeam ? 'ALERT.DO_YOU_REALLY_WANT_TO_DELETE' : 'ALERT.DO_YOU_REALLY_WANT_TO_LEAVE',
    buttons: [
      {
        text: 'CANCEL',
        role: 'cancel',
        cssClass: 'secondary',
      }, {
        text: 'Ok',
        handler: () => {
          if (isDeleteTeam) {
            this.deleteTeam();
          } else {
            this.leaveTeamMemberRole();
            this.removeAdminRole();
          }
        }
      }
    ]
  };
  this.localizedAlertService.displayLocalizedAlert(confirmationAlert, this.team.teamName + '.');
}

  /**
   * @author Syed Saad Qamar @copied from web
   * @description deletes the target team from the teams list (only allowed for admin)
   */
  deleteTeam() { // to be implemented once supported from the backend side
    this.alertController.dismiss();
    this.teamsService.deleteTeam(this.team.teamId).subscribe(() => {
      this.popoverController.dismiss();
    });
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @description leave the member from the team when user is member of the team
   */
  leaveTeamMemberRole() {
    this.alertController.dismiss();
    this.membersService.deleteMemberRole(this.team.memberId).subscribe(() => {
      this.teamsService.removeMemberRole(this.team.teamId);
      this.popoverController.dismiss();
    });
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @description adds the admin of a certain team as a member by creating a member using the admin email. Once the backend responds with
   * success the userTeams will be updated locally too. Finally, the view gets updated by updating the table datasource.
   */
  addTeamAdminAsMember() {
    this.membersService.createMember(this.team.teamId, [{
      email: this.userService.username,
      firstName: '',
      lastName: ''
    }])
    .subscribe( () => {
      this.teamsService.addMemberRole(this.team.teamId);
      this.popoverController.dismiss();
    });
  }

  async editTeamModal() {
    const modal = await this.modalController.create({
      component: ManageTeamComponent,
      componentProps: {
        team: this.team
      }
    });
    modal.onWillDismiss().then(() => {
      this.popoverController.dismiss();
    });
    return await modal.present();
  }

  /**
   * @author Syed Saad Qamar
   * @description If both member and admin select for change roles so after member update roles popover will be closed
   */
  closePopover() {
    if (this.isChangeAdminRole && this.isChangeMemberRole) {
      return;
    }
    this.popoverController.dismiss();
  }
}
