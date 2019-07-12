import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

import { MpMember } from 'src/app/core/models/mp-member.model';
import { PARTICIPATION_TYPES } from 'src/app/core/constants/participation.constants';

@Component({
  selector: 'mp-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})

export class MemberDetailsComponent implements OnInit {
  member: MpMember;
  memberParticipationType: string;
  pariticpationTypes = PARTICIPATION_TYPES;
  cancelWithReason: boolean;
  action: string;
  cancellationReason: string;
  constructor(private navParams: NavParams, private popOverController: PopoverController) {}

  ngOnInit() {
    this.member = {
      firstName: this.navParams.data['firstName'],
      lastName: this.navParams.data['lastName'],
      mail: this.navParams.data['mail'],
      mobile: this.navParams.data['mobile'],
    };
    this.memberParticipationType = this.navParams.data['participationType'];
    this.cancelWithReason = this.navParams.data['cancelWithReason'];
    this.action = this.navParams.data['action'];
    this.cancellationReason = this.navParams.data['cancellationReason'];
  }

  closePopOver () {
    this.popOverController.dismiss();
  }

}
