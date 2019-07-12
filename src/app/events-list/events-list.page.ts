import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonList, Platform, AlertController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { MpTeamInfo } from './../core/models/mp-team-info.model';
import { TeamsService } from './../core/services/teams.service';
import { EventsService } from './../core/services/events.service';
import { MpEvent } from './../core/models/mp-event.model';
import { LocalizedAlertService } from './../core/services/localized-alert.service';
import { EventDetailsComponent } from '../shared/components/event-details/event-details.component';
import { MpCategory } from '../core/models/mp-event-category.model';
import * as moment from 'moment-timezone';
import { MembersService } from '../core/services/members.service';
import { UserService } from '../core/services/user.service';
import { MpDateAdapter } from '../core/services/mp-date-adapter';
import { MpMember } from '../core/models/mp-member.model';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { AddMemberComponent } from '../members-list/components/add-member/add-member.component';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.page.html',
  styleUrls: ['./events-list.page.scss'],
})
export class EventsListPage implements OnInit {
  events: MpEvent[];
  displaySpinner: boolean;
  userTeams: MpTeamInfo[];
  categoriesList: MpCategory[];
  membersData: MpMember[];
  selectedTeamId: number;
  teamMemberId: number;
  isPastEvents: boolean;
  filterString = '';
  isTeamAdmin: boolean;
  isTeamMember: boolean;
  isCancellationReasonRequired: boolean;
  isCancelationReasonDialogOpen: boolean;
  timeFormat = {
    subString: {
      to: 5
    }
  };
  selectedCategoryId = -1;
  resumeReference = null;
  @ViewChild('list') list: IonList;
  constructor(
    private platform: Platform,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private eventsService: EventsService,
    public teamsService: TeamsService,
    private localizedAlertService: LocalizedAlertService,
    public modalController: ModalController,
    public membersService: MembersService,
    public userService: UserService,
    public dateAdapterService: MpDateAdapter,
    public alertController: AlertController,
    private translateService: TranslateService
  ) {
    this.isCancelationReasonDialogOpen = false;

    this.platform.ready().then(() => {
      this.resumeReference = this.platform.resume.subscribe(() => {
        this.initEventsList(true);
      });
    });
  }

  ionViewWillUnload() {
    this.resumeReference.unsubscribe();
  }

  ngOnInit() {
  }

  /**
  * @author Syed Saad Qamar
  * @description check current browser timezone and previous login browser timezone
  */
  checkLocalTimezoneMatch() {
    const currentTimezone = moment.tz.guess();
    if (this.userService.localTimeZone) {
      // we've already matched and showed the popup earlier
      return;
    }

    if (currentTimezone !== this.userService.timezone) {  // if the user's db timezone doesn't match localTimeZone
      this.showTimezoneChangePopup(currentTimezone);
    }
  }


  showTimezoneChangePopup(currentTimezone) {
    this.userService.localTimeZone = currentTimezone;
    const confirmationAlert = {
      header: 'ALERT.ALERT',
      message: 'USER_MESSAGES.MEMBER.CONFIRM_CHANGE_TIMEZONE',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.updateTimzone(currentTimezone);
          }
        }
      ]
    };
    this.localizedAlertService.displayLocalizedAlert(confirmationAlert, currentTimezone + ' ?');
  }

  updateTimzone(currentTimezone) {
    const memberUpdate = { timezone: currentTimezone } as Partial<MpMember>;
    this.membersService.updateMember(this.userService.memberId, memberUpdate as MpMember).subscribe(res => {
      this.userService.timezone = currentTimezone;
    });
  }

  ionViewWillEnter() {
    this.displaySpinner = true;
  }

  ionViewDidEnter() {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams && queryParams['updateEvents']) {
      this.initEventsList(true);
    } else {
      this.initEventsList(false);
    }
  }

  initEventsList(isOnResumeApp) {
    this.userTeams = this.teamsService.userTeams;
    this.selectedTeamId = this.teamsService.selectedTeamId;
    this.updateTeamRoles();
    this.updateEvents(isOnResumeApp);
    this.updateCategories();
    this.closeListSlidingItems();
  }

  refreshEventsList(event) {
    if (event) {
      event.target.complete();
    }
    this.updateTeamRoles();
    this.updateEvents(true);
    this.updateCategories();
    this.closeListSlidingItems();
  }

  /**
  * @author Ahsan Ayaz
  * @desc Closes the sliding item which prevents the issue of items
  * not being slide-able after switching to other pages
  */
  async closeListSlidingItems() {
    if (this.list && this.events && this.events.length) {
      await this.list.closeSlidingItems();
    }
  }

  /**
  * @author Nermeen Mattar
  * @description updates the events variable by using events service to get events for the selected team then sends the
  * received events to init events function which initializes the events for the events table
  */
  updateEvents(isOnResumeApp) {
    this.closeListSlidingItems();
    this.displaySpinner = true;
    this.events = undefined;
    this.eventsService.getEvents(this.selectedTeamId, this.isPastEvents, this.selectedCategoryId)
      .subscribe(({
        events = [],
        myTeamMemberId
      }) => {
        this.events = [...events];
        this.teamMemberId = myTeamMemberId;
        this.eventsService.addNumOfParticipationsToEvents(events);
        this.checkLocalTimezoneMatch();
        if (!isOnResumeApp) {
          this.getTeamMembers();
        }
        this.displaySpinner = false;
      }, () => {
        this.displaySpinner = false;
      });
  }

  /**
  * @author Tobias Trusch
  * @description get categories for the selected team which is required to display show the modal or not
  */
  getTeamMembers() {
    this.membersService.getMembers(this.selectedTeamId).subscribe((res) => {
      this.membersData = res;
      // TODO: cleanup isCancellationReasonRequired
      if (this.membersData.length > 0) {
        this.isCancellationReasonRequired = this.membersData[0].team.cancelWithReason;
      } else {
        this.isCancellationReasonRequired = false;
      }
      this.displaySpinner = false;
      // TODO: show popup if no memeber or no events yet
      if ((this.membersData.length <= 1 || this.events.length === 0)
        && this.teamsService.hasAdminRole(this.selectedTeamId) && !this.isPastEvents) {
        this.showForcesAddEventspopup();
      }
    });
  }


  /**
  * @author Gurpreet Singh
  * @description Show the dialog box to add events or members when there is no member or events
  * there for selceted team.
  */
  async showForcesAddEventspopup() {
    const selectedTeamData = this.userTeams.find(team => team.teamId === this.selectedTeamId);
    const alertData = {
      selectedTeamName: selectedTeamData.teamName,
      noMembersMessage: this.membersData.length <= 1 ? '<div class="data-notification"> \
      <ion-icon name="play" primary></ion-icon> \
      <span>' + this.getTransalatedValue('USER_MESSAGES.EVENT.NO_OTHER_TEAM_MEMBERS_FOR') + ' ' + selectedTeamData.teamName + '</span> \
      </div>' : '',
      noEventsMessage: this.events.length === 0 ? '<div class="data-notification"> \
      <ion-icon name="play" primary></ion-icon> \
      <span>' + this.getTransalatedValue('USER_MESSAGES.EVENT.NO_UPCOMING_EVENTS_FOR') + ' ' + selectedTeamData.teamName + '</span> \
      </div>' : ''
    };

    const confirmationAlert = {
      header: 'USER_MESSAGES.EVENT.ADD_EVENTS_AND_MEMBERS',
      message: '<div class="notification-section">' + alertData.noEventsMessage + alertData.noMembersMessage + '</div>',
      buttons: [
        {
          text: 'EVENT.ADD_EVENTS',
          handler: () => {
            this.router.navigate(['/event-form/new']);
          }
        },
        {
          text: 'MEMBER.ADD_MEMBERS',
          handler: () => {
            this.router.navigate(['/members-list'], { queryParams: { addMember: true } });
          }
        },
        {
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }
      ]
    };
    if (this.membersData.length > 1) {
      confirmationAlert.buttons = confirmationAlert.buttons.filter(btn => btn.text !== 'MEMBER.ADD_MEMBERS');
    }
    if (this.events.length !== 0) {
      confirmationAlert.buttons = confirmationAlert.buttons.filter(btn => btn.text !== 'EVENT.ADD_EVENTS');
    }
    if (this.router.url !== '/event-form/new' && this.router.url !== '/members-list?addMember=true') {
      this.localizedAlertService.displayLocalizedAlert(confirmationAlert, '', true);
    }
  }

  getTransalatedValue(string) {
    let obj: any = '';
    this.translateService.get(string)
      .pipe(
        first()
      )
      .subscribe(translated => obj = translated);
    return obj;
  }

  /**
  * @author Nermeen Mattar
  * @description get categories for the selected team
  */
  updateCategories() {
    this.selectedCategoryId = -1;
    this.categoriesList = [{
      name: 'ALL',
      id: -1
    }];
    this.teamsService.getCategories(this.selectedTeamId).subscribe(categories => {
      this.categoriesList.push(...categories);
    });
  }

  updateTeamRoles() {
    this.isTeamMember = this.teamsService.hasMemberRole(this.selectedTeamId);
    this.isTeamAdmin = this.teamsService.hasAdminRole(this.selectedTeamId);
  }

  getIndexOfTargetEvent(eventId: number) {
    return this.events.findIndex(event => event.id === eventId);
  }

  /**
  * @author Nermeen Mattar
  * @description Updates the displayed events to displays the past events.
  */
  displayPastEvents() {
    this.isPastEvents = true;
    this.updateEvents(true);
  }

  /**
  * @author Nermeen Mattar
  * @description Updates the displayed events to displays the future events.
  */
  displayFutureEvents() {
    this.isPastEvents = false;
    this.updateEvents(true);
  }

  /**
  * @author Nermeen Mattar
  * @description When the user changes the selected team from the menu, it updates the selected team in teamsService with the newly
  * selected team, and updates the displayed events to displays the events that belongs to the selected team.
  */
  changeSelectedTeam() {
    this.teamsService.selectedTeamId = this.selectedTeamId;
    this.updateTeamRoles();
    this.updateCategories();
    this.updateEvents(false);
  }

  /**
  * @author Nermeen Mattar
  * @description toggles user participaion in the target event
  * @param {number} eventId
  */
  toggleParticipationInEvent(eventId: number, currToggle) {
    const toggleValue = currToggle.checked;
    const toggleSuccessMessage = toggleValue ? 'EVENT.EVENT_PARTICIPATION_CONFIRMED' : 'EVENT.EVENT_CANCELATION_CONFIRMED';
    if (!this.isCancelationReasonDialogOpen) {
      if (!currToggle.checked && this.isCancellationReasonRequired) {
        this.displayCancelationReasonDialog(toggleValue, eventId, toggleSuccessMessage, currToggle);
      } else {
        this.callToggleParticipation(toggleValue, eventId, toggleSuccessMessage, currToggle);
      }
    }
  }

  callToggleParticipation(toggleValue: boolean, eventId: number, toggleSuccessMessage: string, currToggle: any, cancelReason?: string) {

    this.eventsService.toggleEventParticipation(toggleValue, eventId, this.teamMemberId, toggleSuccessMessage, cancelReason)
      .subscribe(res => {
        const event = this.events[this.getIndexOfTargetEvent(eventId)];
        event.numOfParticipations += toggleValue ? 1 : -1;
        event.myParticipation.action = toggleValue ? 'participate' : 'cancel';
      }, () => {
        currToggle.checked = !toggleValue;
      });
  }

  editEvent(eventId: number) {
    this.router.navigate([`/event-form/${eventId}`]);
  }

  copyEvent(eventId: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: { copy: true }
    };
    this.router.navigate([`/event-form/${eventId}`], navigationExtras);
  }


  /**
  * @author Nermeen Mattar
  * @description  displays the event details modal and passes the event id along with wether the event is a past event. Upon closing the
  * modal a data gets received which indicates if the there is a need to update events
  * @param eventId
  */
  async displayEventDetailsModal(eventId: number) {
    const modal = await this.modalController.create({
      component: EventDetailsComponent,
      componentProps: {
        'id': eventId,
        'isPastEvent': this.isPastEvents
      }
    });
    modal.present();
    const {
      data
    } = await modal.onDidDismiss();
    // to refresh if modal disappiears:
    // this.refreshEventsList(null);
    if (data && data.eventUpdated) {
      this.updateEvents(true);
    }
  }

  /**
  * @author Nermeen Mattar
  * @description deletes the target event from the events list (only allowed for admin). Note: for recurring events we check if the
  * user chose to delete all series or a single event
  * @param {number} eventId
  */
  deleteEvent(eventId: number, deleteType: string) {
    this.closeListSlidingItems();
    this.displaySpinner = true;
    if (deleteType === 'series') {
      this.eventsService.deleteRecurringEvent(eventId).subscribe(() => {
        this.updateEvents(true);
      });
    } else {
      this.eventsService.deleteEvent(eventId).subscribe(() => {
        this.events.splice(this.getIndexOfTargetEvent(eventId), 1);
        this.displaySpinner = false;
      });
    }
  }

  /**
  * @author Nermeen Mattar
  * @description  displays a delete confirm dialog before actually deleting the event by
  * @param {MpEvent} event
  */
  displayConfirmDelete(event: MpEvent) {
    const inputs = [];
    if (event.recurringEvent) {
      inputs.push({
        name: 'single',
        type: 'radio',
        label: 'USER_MESSAGES.EVENT.EVENT_THIS_SINGLE_EVENT',
        value: 'single',
        checked: true
      });
      inputs.push({
        name: 'series',
        type: 'radio',
        label: 'USER_MESSAGES.EVENT.EVENT_THIS_SERIES_EVENT',
        value: 'series',
      });
    }
    const confirmationAlert = {
      header: 'USER_MESSAGES.EVENT.EVENT_CONFIRM_DELETING_HEADER',
      message: event.recurringEvent ?
        'USER_MESSAGES.EVENT.EVENT_CONFIRM_DELETING_BODY'
        :
        'USER_MESSAGES.EVENT.EVENT_CONFIRM_DELETING_BODY_SINGLE',
      inputs: inputs,
      buttons: [{
        text: 'CANCEL',
        role: 'cancel',
        cssClass: 'secondary',
      },
      {
        text: 'CONFIRM',
        handler: (deleteType) => {
          this.deleteEvent(event.id, deleteType);
        }
      }
      ]
    };
    this.localizedAlertService.displayLocalizedAlert(confirmationAlert);
  }

  /**
  * @author Nermeen Mattar
  * @description prompts the user to enter a reason by displaying the cancelation reason dialog
  * @param alertObj
  */
  displayCancelationReasonDialog(toggleValue: boolean, eventId: number, toggleSuccessMessage: string, currToggle: any) {
    this.isCancelationReasonDialogOpen = true;
    const confirmationAlert = {
      inputs: [{
        name: 'cancelReason',
        type: 'textarea',
        placeholder: 'EVENT.REASON_FOR_CANCELLATION'
      }],

      message: 'EVENT.WANT_CANCELLATION_REASON',
      buttons: [{
        text: 'CANCEL',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (data) => {
          currToggle.checked = !toggleValue;
          this.isCancelationReasonDialogOpen = false;
        }
      },
      {
        text: 'SEND',
        handler: (data) => {
          this.callToggleParticipation(toggleValue, eventId, toggleSuccessMessage, currToggle, data.cancelReason);
          this.isCancelationReasonDialogOpen = false;
        }
      }
      ]
    };
    this.localizedAlertService.displayLocalizedAlert(confirmationAlert);
  }
}
