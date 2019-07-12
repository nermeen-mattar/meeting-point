import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonList } from '@ionic/angular';
import { MpTeamInfo } from '../core/models/mp-team-info.model';
import { TeamsService } from '../core/services/teams.service';
import { MembersService } from '../core/services/members.service';
import { MpMember } from '../core/models/mp-member.model';
import { ModalController } from '@ionic/angular';
import { AddMemberComponent } from './components/add-member/add-member.component';
import { MemberDetailsComponent } from './components/member-details/member-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../core/services/events.service';
import { LocalizedAlertService } from '../core/services/localized-alert.service';
import { UserService } from '../core/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { MpEvent } from '../core/models/mp-event.model';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.page.html',
  styleUrls: ['./members-list.page.scss'],
})
export class MembersListPage implements OnInit {
  displaySpinner = false;
  membersList: Array<MpMember> = [];
  userTeams: MpTeamInfo[];
  selectedTeamId: number;
  teamMemberId: number;
  hasAdminRole: boolean;
  isTeamAdmin: boolean;
  isTeamMember: boolean;
  filterString = '';
  filterData: Array<MpMember> = [];
  events: MpEvent[];
  @ViewChild('list') list: IonList;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    public membersService: MembersService,
    public teamsService: TeamsService,
    private eventsService: EventsService,
    private localizedAlertService: LocalizedAlertService,
    public modalController: ModalController,
    public userService: UserService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.displaySpinner = true;
    this.userTeams = this.teamsService.userTeams;
    this.selectedTeamId = this.teamsService.selectedTeamId;

    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams && queryParams['addMember']) {
      this.openMemberAddModal();
    }
    this.isTeamMember = this.teamsService.hasMemberRole(this.selectedTeamId);
    this.isTeamAdmin = this.teamsService.hasAdminRole(this.selectedTeamId);
    if (this.isTeamMember || this.isTeamAdmin) {
      if (queryParams && queryParams['addMember']) {
        this.updateMembers(false);
      } else {
        this.updateMembers(true);
      }
    } else {
      this.displaySpinner = false;
    }
  }

  ionViewDidEnter() {
    this.closeListSlidingItems();
  }

  ionViewWillLeave() {
    this.closeListSlidingItems();
  }

  /**
   * @author Ahsan Ayaz
   * @desc Closes the sliding item which prevents the issue of items
   * not being slide-able after switching to other pages
   */
  async closeListSlidingItems() {
    if (this.list && this.membersList.length) {
      await this.list.closeSlidingItems();
    }
  }

  /**
   * @author Syed Saad Qamar
   * @description when user click on ok button the user delete from the memberList and list update and popup will close.
  */
  async deleteModel(memberData, index) {
    const showNameOrEmail = memberData.member.fullName ? memberData.member.fullName : memberData.member.mail;
    const alert = await this.alertController.create({
      header: 'Alert',
      message: 'Do you really want to delete ' + showNameOrEmail + '.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Ok',
          handler: () => {
            this.deleteMember(memberData.id, index);
            alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * @author Syed Saad Qamar
   * @description delete the member from the database by using members service deleteMember function to passing member id.
   */
  deleteMember(memberId, index) {
    this.displaySpinner = true;
    this.closeListSlidingItems();
    this.membersService.deleteMemberRole(memberId).subscribe(res => {
      this.memberDeleted(index);
    });
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @description this function will be called when backend delete a member successfully
   */
  memberDeleted(index) {
    this.filterData.splice(index, 1);
    this.membersList.splice(index, 1);
    this.displaySpinner = false;
  }

  /**
 * @author Nermeen Mattar
 * @description get the events variable by using events service to get events for the selected team then sends the
 * received events to init events function which initializes the events for the events table
 */
  getEvents(isOnResumeApp) {
    if (isOnResumeApp) {
      this.displaySpinner = true;
      this.events = undefined;
      this.eventsService.getEvents(this.selectedTeamId, false, -1)
        .subscribe(({
          events = [],
          myTeamMemberId
        }) => {
          this.events = [...events];
          this.teamMemberId = myTeamMemberId;
          this.displaySpinner = false;
          // TODO: show popup if no memeber or no events yet
          if ((this.membersList.length <= 1 || this.events.length === 0)
            && this.teamsService.hasAdminRole(this.selectedTeamId)) {
            this.showForcesAddEventspopup();
          }
        }, () => {
          this.displaySpinner = false;
        });
    }
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
      noMembersMessage: this.membersList.length <= 1 ? '<div class="data-notification"> \
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
            this.openMemberAddModal();
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
    if (this.membersList.length > 1) {
      confirmationAlert.buttons = confirmationAlert.buttons.filter(btn => btn.text !== 'MEMBER.ADD_MEMBERS');
    }
    if (this.events.length !== 0) {
      confirmationAlert.buttons = confirmationAlert.buttons.filter(btn => btn.text !== 'EVENT.ADD_EVENTS');
    }
    if (this.router.url !== '/event-form/new' && this.router.url !== '/members-list?addMember=true') {
      this.localizedAlertService.displayLocalizedAlert(confirmationAlert, '', true);
    }
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @description updates the members variable by using members service to get members for the selected team then sends
   * the received members to initMembersDataSource function which initializes the membersDataSource for the members table
   */
  async updateMembers(newTeamSelect) {
    this.closeListSlidingItems();
    if (newTeamSelect) {
      this.displaySpinner = true;
    }
    this.teamsService.selectedTeamId = this.selectedTeamId; // temp (to enhance)
    this.membersService.getMembers(this.selectedTeamId).subscribe((res) => { // {members= [], myTeamMemberId}
      this.updateMembersList(res, newTeamSelect);
      this.isTeamMember = this.teamsService.hasMemberRole(this.selectedTeamId);
      this.isTeamAdmin = this.teamsService.hasAdminRole(this.selectedTeamId);
    });
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @description creates a new object of type material table data source and passes to it the members data to be displayed on the table
   * @param {MpMember[]} members
   */
  updateMembersList(members: MpMember[], needUpdate) {
    this.filterString = ''; // reset any string the user entered in the search input
    this.membersList = [...members]; // Assign the data to the member list for the table to render
    this.filterData = [...members];
    this.displaySpinner = false;
    this.getEvents(needUpdate);
  }

  /**
   * @author Syed Saad Qamar
   * @description filters the members list based on the user's input
   * @param {string} filterValue
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Removes whitespace
    this.filterData = this.membersList.filter((member) =>
      this.membersService.membersFilter()(member.member, filterValue) || this.testCustomFilters(member, filterValue));
  }

  testCustomFilters(member, filterValue) {
    const isAdminFilter = ('admin').includes(filterValue.toString().toLowerCase());
    const isMemberFilter = ('member').includes(filterValue.toString().toLowerCase());
    const isMailUncofirmedFilter = ('unconfirmed').includes(filterValue.toString().toLowerCase());
    const isDisabledFilter = ('disabled').includes(filterValue.toString().toLowerCase());
    return isAdminFilter && member.isAdmin || isMailUncofirmedFilter && !member.acceptInvitation
      || isDisabledFilter && !member.active || isMemberFilter;
  }

  async openMemberAddModal() {
    const modal = await this.modalController.create({
      component: AddMemberComponent,
      componentProps: {
        'teamId': this.selectedTeamId,
      }
    });
    modal.onWillDismiss().then((value) => {
      this.updateMembers(value.data);
    });
    return await modal.present();
  }

  /**
   * @author Syed Saad Qamar
   * @description Open model and displays member details based on member id that are passing through param
   * and update member that when modal closed
   * @param memberId
  */
  async displayMemberDetailsModal(member: MpTeamInfo) {
    const modal = await this.modalController.create({
      component: MemberDetailsComponent,
      componentProps: {
        value: member,
        isAdmin: this.isTeamAdmin
      }
    });
    modal.present();
    modal.onWillDismiss().then(() => {
      this.updateMembers(false);
    });
  }

  /**
  * @author Syed Saad Qamar @copied from web
  * @description sends a request to resend the invitation link to the member with the passed id.
  * @param  {string} memberMail
  */
  resedInvitationLink(teamMemberId: number) {
    this.closeListSlidingItems();
    this.membersService.resendInvitation(teamMemberId).subscribe(res => res);
  }

  getIndexOfTargetMember(memberId: number) {
    return this.filterData.findIndex(member => member.id === memberId);
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
   * @author Syed Saad Qamar @copied from web
   * @description changes the member activtaion status by first toggling current activation status then sending this data to the members
   * service. Once the data is sent to the backend successfuly, the subscription callback changes the data on the client side accordingaly.
   * @param {MpMember} member
   */
  changeMemberActivationStatus(member) {
    this.closeListSlidingItems();
    const updatedFlag: number = member.active ? 0 : 1;
    this.membersService.changeMemberActivationStatus({
      flag: updatedFlag,
      /* backend expects number */
      teamId: member.team.id,
      teamMemberId: member.id
    }).subscribe(() => {
      this.membersList[this.getIndexOfTargetMember(member.id)].active = !member.active;
    });
  }
}
