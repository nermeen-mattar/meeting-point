import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MpTeamInfo } from '../core/models/mp-team-info.model';
import { MembersStatisticsService } from '../core/services/members-statistics.service';
import { TeamsService } from '../core/services/teams.service';
import { DateService } from '../core/services/date.service';
import { MpMember } from '../core/models/mp-member.model';
import { MembersService } from '../core/services/members.service';
import { MpCategory } from '../core/models/mp-event-category.model';
import { ModalController } from '@ionic/angular';
import { MemberStatisticsDetailsComponent } from './components/member-statistics-details/member-statistics-details.component';

@Component({
  selector: 'mp-members-statistics',
  templateUrl: './members-statistics.page.html',
  styleUrls: ['./members-statistics.page.scss'],
})
export class MembersStatisticsPage implements OnInit {
  displaySpinner: boolean;
  selectedTeamId: number;
  teamMemberId: number;
  filterString: string;
  dateRangeFormGroup: FormGroup = new FormGroup({});
  teamsTheUserIsAdminOf: MpTeamInfo[];
  filterData: Array < MpMember > = [];
  membersList: Array < MpMember > = [];
  categoriesList: MpCategory[];
  selectedCategory: string;
  categoryId: number;
  selectMaxDate: number;
  selectMinDate: number;
  membersFilter: (memberObj: MpMember, filterStr: string) => boolean;
  constructor(
    private membersStatisticsService: MembersStatisticsService,
    private teamsService: TeamsService,
    public dateService: DateService,
    public membersService: MembersService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.teamsTheUserIsAdminOf = this.teamsService.getTeamsTheUserIsAdminOf();
    this.selectedTeamId = this.teamsService.selectedTeamId;
    if (!this.teamsService.hasAdminRole(this.selectedTeamId)) {
      this.selectedTeamId = this.teamsTheUserIsAdminOf.length && this.teamsTheUserIsAdminOf[0].teamId;
    }
    this.membersFilter = this.membersService.membersFilter(
      ['firstName', 'lastName', 'email', 'participations', 'cancelations']
    );
    this.createDateRangeFormGroup();
    this.dateRangeFormGroup.valueChanges.subscribe(res => this.dateRangeChange());
    this.updateMembersStatistics();
    this.getTeamCategories();
    this.selectMaxDate = new Date().getFullYear() + 10;
    this.selectMinDate = new Date().getFullYear() - 10;
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @description updates the members variable by using members service to get members for the selected team then sends
   * the received members to initMembersDataSource function which initializes the membersDataSource for the members table
   */
  updateMembersStatistics() {
    this.displaySpinner = true;
    this.teamsService.selectedTeamId = this.selectedTeamId; // temp (to enhance)
    this.membersStatisticsService.getMembersStatistics(this.selectedTeamId).subscribe((res) => { // {members= [], myTeamMemberId}
      this.updateMembersList(res.teamMembers);
    }, () => {
      this.membersList = []; // Assign the empty array to the member list for the table
      this.filterData = [];
      this.displaySpinner = false;
    });
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @description creates a new object of type material table data source and passes to it the members data to be displayed on the table
   * @param {MpMember[]} members
   */
  updateMembersList(members: MpMember[]) {
    this.filterString = ''; // reset any string the user entered in the search input
    this.membersList = [...members]; // Assign the data to the member list for the table to render
    this.filterData = [...members];
    this.displaySpinner = false;
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @description creates the start date and end date form controls (standalone form controls).
   */
  createDateRangeFormGroup() {
    if (this.dateService.selectedDateRange && this.dateService.selectedDateRange.dateFrom) {
      this.dateRangeFormGroup.addControl('dateFrom',
        new FormControl(this.dateService.selectedDateRange.dateFrom.toISOString(), [Validators.required]));
      this.dateRangeFormGroup.addControl('dateTo',
        new FormControl(this.dateService.selectedDateRange.dateTo.toISOString(), [Validators.required]));
    }
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @description sets the selected date range in the date service and calls update members statistics function
   */
  dateRangeChange() {
    this.dateRangeFormGroup.value.dateFrom = new Date(this.dateRangeFormGroup.value.dateFrom);
    this.dateRangeFormGroup.value.dateTo = new Date(this.dateRangeFormGroup.value.dateTo);
    this.dateService.selectedDateRange = this.dateRangeFormGroup.value;
    this.updateMembersStatistics();
  }

  /**
   * @author Syed Saad Qamar
   * @description filters the members list based on the user's input
   * @param {string} filterValue
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Removes whitespace
    this.filterData = this.membersList.filter((member) => this.membersFilter(member, filterValue));
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @description get saved categories from API for selected Team
   */
  getTeamCategories() {
    this.teamsService.getCategories(this.selectedTeamId).subscribe(res => {
      this.categoriesList = res;
    });
    this.selectedCategory = 'all';
    this.categoryId = null;
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @description When the user select the category from the catgories filter drop-down, it request the events from api
   * that belongs to selected category and displayes them
   */
  filterByCategory(value) {
    if (value === 'all') {
      this.selectedCategory = 'all';
      this.categoryId = null;
    } else {
      this.selectedCategory = value;
      this.categoryId = value;
    }
    this.getMemberByDateAndCategoryId();
  }

  getMemberByDateAndCategoryId() {
    const data = {
      categoryId: this.categoryId,
      dateFrom: this.dateService.selectedDateRange.dateFrom,
      dateTo: this.dateService.selectedDateRange.dateTo,
      teamId: this.selectedTeamId
    };
    this.membersStatisticsService.getMemberByDateAndCategoryId(data).subscribe((res) => { // {members= [], myTeamMemberId}
      this.updateMembersList(res.teamMembers);
    });
  }

  async openDetailsModal(member) {
    const modal = await this.modalController.create({
      component: MemberStatisticsDetailsComponent,
      componentProps: {
        'member': member,
      }
    });
    modal.onWillDismiss().then(() => {
      this.selectedTeamId = this.teamsService.selectedTeamId;
      this.updateMembersStatistics();
    });
    return await modal.present();
  }

}
