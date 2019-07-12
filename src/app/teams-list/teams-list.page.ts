import { Component, OnInit } from '@angular/core';
import { TeamsService } from '../core/services/teams.service';
import { MpTeamInfo } from '../core/models/mp-team-info.model';
import { MpClientSideTeamRoles } from '../core/models/mp-client-side-team-roles.model';
import { PopoverController, ModalController } from '@ionic/angular';
import { TeamsListPopoverComponent } from './components/teams-list-popover/teams-list-popover.component';
import { ManageTeamComponent } from './components/manage-team/manage-team.component';

@Component({
  selector: 'mp-teams-list',
  templateUrl: './teams-list.page.html',
  styleUrls: ['./teams-list.page.scss'],
})
export class TeamsListPage implements OnInit {

  userTeams: MpTeamInfo[];
  displaySpinner = false;
  teamRoles: MpClientSideTeamRoles;
  constructor(
    public teamsService: TeamsService,
    public popoverController: PopoverController,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.displaySpinner = true;
    this.updateTeamList();
  }

  /**
   * @author Syed Saad Qamar
   * @desc fetch teamRoles and userTeams from the service and display data on the screen
   */
  updateTeamList () {
    this.teamRoles = this.teamsService.teamRoles;
    this.userTeams = [...this.teamsService.userTeams];
    this.displaySpinner = false;
  }

  /**
   * @author Syed Saad Qamar
   * @desc when click on popover icon that function will be called and list will be shown then click on any list item
   * that params will be passed and popup close onWillDismiss will trigger
   * @param {any} ev
   * @param {boolean} adminRole
   * @param {boolean} memberRole
   * @param {MpTeamInfo} team
   */
  async showTeamsListPopover(ev: any, adminRole: boolean, memberRole: boolean, team: MpTeamInfo) {
    const popover = await this.popoverController.create({
      component: TeamsListPopoverComponent,
      event: ev,
      translucent: true,
      componentProps: {
        hasAdminRole: adminRole,
        hasMemberRole: memberRole,
        team: team
      }
    });
    popover.onWillDismiss().then(() => {
      this.displaySpinner = true;
      this.updateTeamList();
    });
    return await popover.present();
  }

  /**
   * @author Syed Saad Qamar
   * @desc check user has admin role using team id and return true or false
   * @param {number} teamId
   */
  hasAdminRole(teamId) {
    return this.teamRoles.teamAdmins.includes(teamId);
  }

  /**
   * @author Syed Saad Qamar
   * @desc check user has member role using team id and return true or false
   * @param {number} teamId
   */
  hasMemberRole(teamId) {
    return this.teamRoles.teamMembers.includes(teamId);
  }

  async openManageTeamModal() {
    const modal = await this.modalController.create({
      component: ManageTeamComponent,
      componentProps: {
      }
    });
    modal.onWillDismiss().then(() => {
      this.displaySpinner = true;
      this.updateTeamList();
    });
    return await modal.present();
  }
}
