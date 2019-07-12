import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { MpDateRange } from 'src/app/core/models/mp-date-range.model';
import { DateService } from 'src/app/core/services/date.service';
import { MembersStatisticsService } from 'src/app/core/services/members-statistics.service';
import { EventsService } from 'src/app/core/services/events.service';
import { MpEvent } from 'src/app/core/models/mp-event.model';

@Component({
  selector: 'mp-member-statistics-details',
  templateUrl: './member-statistics-details.component.html',
  styleUrls: ['./member-statistics-details.component.scss']
})
export class MemberStatisticsDetailsComponent implements OnInit {

  displaySpinner = true;
  memberId: number;
  actionType: string;
  dateRange: MpDateRange;
  email: string;
  numberOfRecords: number;
  member: string;
  events: MpEvent[];
  constructor(
    public modalController: ModalController,
    public dateService: DateService,
    public membersStatisticsService: MembersStatisticsService,
    public eventsService: EventsService,
    public navParams: NavParams
  ) { }

  ngOnInit() {
    this.memberId = this.navParams.data.member.memberId;
    this.actionType = this.navParams.data.member.actionType;
    this.dateRange = this.dateService.selectedDateRange;
    if (this.memberId && this.dateRange) {
      this.updateMemberDetailsStatistics();
    }
  }

  /**
   * @author Syed Saad Qamar
   * @description close the model when invite send or user press back button
   */
  closeModal () {
    this.modalController.dismiss();
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @description updates the members variable by using members service to get members for the selected team then sends
   * the received members to initMembersDataSource function which initializes the membersDataSource for the members table
   */
  updateMemberDetailsStatistics() {
    this.displaySpinner = true;
    this.membersStatisticsService.getMemberStatisticsDetails(this.actionType, this.memberId, 1, 100).subscribe(({
      firstName,
      lastName,
      totalCount,
      email,
      events = []
    }) => {
      this.email = email;
      this.numberOfRecords = totalCount;
      this.member = firstName.concat(' ').concat(lastName);
      this.events = events;
      this.eventsService.addNumOfParticipationsToEvents(events);
      this.displaySpinner = false;
    });
  }

}
