import { Component, OnInit } from '@angular/core';
import { TeamsService } from 'src/app/core/services/teams.service';
import { ModalController, PopoverController } from '@ionic/angular';
import { MpMember } from 'src/app/core/models/mp-member.model';
import { MemberDetailsPopoverComponent } from './member-details-popover/member-details-popover.component';
import { NavParams } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { UserMessagesService } from 'src/app/core/services/user-messages.service';

@Component({
  selector: 'mp-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {

  displaySpinner = true;
  selectedTeamId: number;
  isTeamAdmin: boolean;
  isTeamMember: boolean;
  memberDetails: MpMember;
  constructor(
    public teamsService: TeamsService,
    public modalController: ModalController,
    public popoverController: PopoverController,
    public navParams: NavParams,
    public clipboard: Clipboard,
    public userMessagesService: UserMessagesService
  ) { }

  ngOnInit() {
    this.displaySpinner = true;
    this.selectedTeamId = this.teamsService.selectedTeamId;
    this.memberDetails = this.navParams.data.value;
    this.isTeamAdmin = this.navParams.data.isAdmin;
    this.displaySpinner = false;
  }

  /**
   * @author Syed Saad Qamar
   * @description close the model when invite send or user press back button
   */
  closeModal () {
    this.modalController.dismiss();
  }

  async showMemberDetailsPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: MemberDetailsPopoverComponent,
      event: ev,
      translucent: true,
      componentProps: {
        member_details: this.memberDetails
      }
    });
    popover.onWillDismiss().then((memberDetails) => {
      if (memberDetails.data) {
        this.memberDetails = memberDetails.data;
      }
    });
    return await popover.present();
  }

  async copyEmail(email) {
    this.clipboard.copy(email);
    this.userMessagesService.showUserMessage( {
      success: 'EMAIL_COPIED'
    }, 'success');
  }

}
