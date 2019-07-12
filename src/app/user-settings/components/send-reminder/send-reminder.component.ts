import { Component, OnInit, ElementRef, ViewChildren } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MembersService } from 'src/app/core/services/members.service';
import { TeamsService } from 'src/app/core/services/teams.service';
import { MpTeamInfo } from 'src/app/core/models/mp-team-info.model';

@Component({
  selector: 'mp-send-reminder',
  templateUrl: './send-reminder.component.html',
  styleUrls: ['./send-reminder.component.scss']
})
export class SendReminderComponent implements OnInit {

  @ViewChildren('teamsToggle') teamsToggle: ElementRef;
  selectedTeamId: number;
  teamsTheUserIsMemberOf: MpTeamInfo[];
  displaySpinner = false;
  sendReminderData = [];
  allTeamsSelected = false;

  constructor(
    public modalController: ModalController,
    public membersService: MembersService,
    public teamsService: TeamsService
  ) {
    this.teamsTheUserIsMemberOf = this.teamsService.getTeamsTheUserIsMemberOf();
    if (this.teamsTheUserIsMemberOf.length > 0) {
      this.selectedTeamId = this.teamsTheUserIsMemberOf[0].teamId;
    }
  }

  ngOnInit() {
    this.membersService.getTeamMembers().subscribe(info => {
      let isAllselected: boolean;
      const teamsData = info.filter(team => this.teamsTheUserIsMemberOf.findIndex(t => t.teamId === team.team.id) !== -1);
      this.teamsToggle['_results'].map((toggle, index) => {
        if (!teamsData[index].sendReminder) {
          isAllselected = false;
        }
        const team = teamsData.find(memberData => memberData.team.id === this.teamsTheUserIsMemberOf[index].teamId);
        toggle.checked = team.sendReminder;
      });
      if (isAllselected) {
        this.allTeamsSelected = true;
      }
    });
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
  * @description pass sendReminder and memberId to server and receive response from server
  */
  notification() {
    this.displaySpinner = true;
    this.membersService.setReminderForEvents(this.sendReminderData).subscribe(() => {
      this.closeModal();
      this.displaySpinner = false;
    }, () => {
      this.displaySpinner = false;
    });
  }

  setSendReminder(isChecked, teamId) {
    if (!isChecked) {
      this.allTeamsSelected = false;
    } else {
      setTimeout(() => {
        if (this.teamsToggle['_results'].every(toggle => toggle.checked === true)) {
          this.allTeamsSelected = true;
        }
      });
    }
    if (this.sendReminderData.length > 0) {
      const selectedTeamId = this.sendReminderData.map(data => data.teamId).indexOf(teamId);
      if ( selectedTeamId > -1) {
        this.sendReminderData[selectedTeamId].teamId = teamId;
        this.sendReminderData[selectedTeamId].sendReminder = isChecked;
      } else {
        this.sendReminderData.push({
          teamId: teamId,
          sendReminder: isChecked
        });
      }
    } else {
      this.sendReminderData.push({
        teamId: teamId,
        sendReminder: isChecked
      });
    }
  }

  selectAll(isChecked) {
    this.teamsToggle['_results'].map((toggle) => {
      toggle.checked = isChecked;
    });
    this.sendReminderData = [];
    this.teamsTheUserIsMemberOf.map(team => {
      this.sendReminderData.push({
        teamId: team.teamId,
        sendReminder: isChecked
      });
    });
  }
}
