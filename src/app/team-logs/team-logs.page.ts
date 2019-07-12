import { Component, OnInit } from '@angular/core';
import { MpTeamInfo } from '../core/models/mp-team-info.model';
import { TeamsService } from '../core/services/teams.service';
import { TeamLogItem } from '../core/models/team-log';
import { UserService } from '../core/services/user.service';
import { ModalController } from '@ionic/angular';
import { EventDetailsComponent } from '../shared/components/event-details/event-details.component';
import { UserMessagesService } from '../core/services/user-messages.service';

@Component({
  selector: 'mp-team-logs',
  templateUrl: './team-logs.page.html',
  styleUrls: ['./team-logs.page.scss'],
})
export class TeamLogsPage implements OnInit {
  teamLogs: Array<TeamLogItem> = [];
  displaySpinner = false;
  userTeams: MpTeamInfo[];
  selectedTeamId: number;
  loadingData: boolean;
  constructor(
    public teamsService: TeamsService,
    private userService: UserService,
    private modalController: ModalController,
    private userMessagesService: UserMessagesService
  ) { }

  ngOnInit() {
    this.userTeams = this.teamsService.userTeams;
    this.selectedTeamId = this.userTeams[0].teamId;
    this.getTeamLogs();
  }

  async displayEventDetailsModal(eventId: number) {
    const modal = await this.modalController.create({
      component: EventDetailsComponent,
      componentProps: {
        'id': eventId
      }
    });
    modal.present();
  }

  teamChanged() {
    const isTeamAdmin = this.teamsService.hasAdminRole(this.selectedTeamId);
    if (!isTeamAdmin) {
      this.teamLogs = [];
      return this.userMessagesService.showUserMessage({
        fail: 'ONLY_ADMINS_CAN_SEE_LOGS'
      }, 'fail', null);
    }
    this.getTeamLogs();
  }

  getTeamLogs() {
    this.loadingData = true;
    this.teamsService.getTeamLogs(this.selectedTeamId, this.userService.timezone)
      .subscribe((logs) => {
        this.teamLogs = logs;
        this.loadingData = false;
      }, err => {
        console.error(err);
        this.loadingData = false;
      });
  }

}
