import { Component, OnInit } from '@angular/core';
import { IonToggle, ModalController, PopoverController, NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { MpEventDetails } from 'src/app/core/models/mp-event-details.model';
import { EventsService } from 'src/app/core/services/events.service';
import { MembersService } from 'src/app/core/services/members.service';
import { TeamsService } from 'src/app/core/services/teams.service';
import { MpMember } from 'src/app/core/models/mp-member.model';
import { PARTICIPATION_TYPES } from 'src/app/core/constants/participation.constants';
import { MemberDetailsComponent } from '../member-details/member-details.component';
import { MpDateAdapter } from 'src/app/core/services/mp-date-adapter';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'mp-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  timeFormat = {
    subString: {
      to: 5
    }
  };
  searchTerm: string;
  eventDetails: MpEventDetails;
  selectedTeamId: number;
  isTeamAdmin: boolean;
  eventId: number;
  isPastEvent: boolean;
  isEventUpdated: boolean;
  displaySpinner = true;
  participationTypes = PARTICIPATION_TYPES;
  userTimezone: string;
  constructor(
    private eventsService: EventsService,
    private membersService: MembersService,
    private teamsService: TeamsService,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private route: ActivatedRoute,
    private router: Router,
    private navParams: NavParams,
    public dateAdapterService: MpDateAdapter,
    public userService: UserService
  ) {
  }

  ngOnInit() {
    this.selectedTeamId = this.teamsService.selectedTeamId;
    this.isTeamAdmin = this.teamsService.hasAdminRole(this.selectedTeamId);
    this.eventId = this.navParams.data['id']; //  this.route.snapshot.queryParams['id']; commented as there is a weird issue; sometime
    this.isPastEvent = this.navParams.data['isPastEvent'];

    this.getEvent();
    this.userTimezone = this.userService.timezone;
  }

  getEvent() {
    this.eventsService.getEventDetails(this.eventId)
      .subscribe((eventDetails: MpEventDetails) => {
        this.eventDetails = eventDetails;
        this.eventDetails.absent = this.membersService.processMembers(
          this.eventDetails.absent
        )
        .filter(member => member.acceptInvitation === true);
        this.eventDetails.present = this.membersService.processMembers(
          this.eventDetails.present
        ).filter(member => member.acceptInvitation === true);
        this.displaySpinner = false;
      }, (err) => {
        this.displaySpinner = false;
        // TODO: Nermeen, show error toast here
      });
  }

  closeModal () {
    this.modalController.dismiss({eventUpdated: this.isEventUpdated});
  }

  /**
   * @author Nermeen Mattar
   * @description toggles the participaion of the target member
   * @param {boolean} toggleValue
   * @param {MpMember} toggledMember
   * @param {IonToggle} currToggle
   */
  toggleMemberParticipation(toggleValue: boolean, toggledMember: MpMember, currToggle: IonToggle) {
    const toggleSuccessMessage = toggleValue ? 'MEMBER.MEMBER_MOVED_TO_PARTICIPATION' : 'MEMBER.MEMBER_MOVED_TO_CANCELATION';
    this.eventsService.toggleEventParticipation(toggleValue, this.eventId , toggledMember.id, toggleSuccessMessage, 'by team admin')
      .subscribe(() => {
        const {toggleType, toggleInverseType} = toggleValue ?
        {toggleType: PARTICIPATION_TYPES.absent, toggleInverseType: PARTICIPATION_TYPES.present} :
        {toggleType:  PARTICIPATION_TYPES.present, toggleInverseType: PARTICIPATION_TYPES.absent};
        this.eventDetails[toggleType] = this.eventDetails[toggleType].filter( member => {
          return member.id !== toggledMember.id;
        });
        this.eventDetails[toggleInverseType].push(toggledMember);
        this.isEventUpdated = true;
        this.getEvent();
      }, () => {
        currToggle.checked = false;
      });
  }

  displayMemberInfo(member: MpMember) {
    const confirmationAlert = {
      header: 'MEMBER.MEMBER_INFO',
      message:  'EVENT.WANT_CANCELLATION_REASON',
      buttons: [{
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
        text: 'SEND',
        handler: () => {
          // send message to backend once service is in place
        }
       }
      ]
    };
  }

  // goToEditEvent() {
  //   this.closeModal();
  //   this.router.navigateByUrl('/event-form/' + this.eventId);
  // }

  async displayMemberDetails(ev: any, participationType: number) {
    const popover = await this.popoverController.create({
      component: MemberDetailsComponent,
      componentProps: {
        ...ev.member,
        participationType: participationType,
        cancelWithReason: ev.team.cancelWithReason,
        action: ev.participation.action,
        cancellationReason: ev.participation.cancellationReason
      },
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
}
