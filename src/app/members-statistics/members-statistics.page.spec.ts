import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersStatisticsPage } from './members-statistics.page';
import { membersData, MembersServiceMock } from '../shared/mocks/services/members.service.mock';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { MembersStatisticsService } from '../core/services/members-statistics.service';
import { MembersStatisticsServiceMock } from '../shared/mocks/services/member-statistics.service.mock';
import { TeamsService } from '../core/services/teams.service';
import { TeamsServiceMock } from '../shared/mocks/services/teams.service.mock';
import { DateService } from '../core/services/date.service';
import { MembersService } from '../core/services/members.service';
import { EventsServiceMock } from '../shared/mocks/services/events.service.mock';
import { EventsService } from '../core/services/events.service';
import { DateServiceMock } from '../shared/mocks/services/date.service.mock';

describe('MembersStatisticsPage', () => {
  let component: MembersStatisticsPage;
  let fixture: ComponentFixture<MembersStatisticsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembersStatisticsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        ModalController,
        {
          provide: MembersStatisticsService,
          useClass: MembersStatisticsServiceMock
        },
        {
          provide: TeamsService,
          useClass: TeamsServiceMock
        },
        {
          provide: DateService,
          useClass: DateServiceMock
        },
        {
          provide: MembersService,
          useClass: MembersServiceMock
        },
        {
          provide: EventsService,
          useClass: EventsServiceMock
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersStatisticsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createDateRangeFormGroup(), updateMembersStatistics() and getTeamCategories when component initialize', () => {
    spyOn(component, 'createDateRangeFormGroup');
    spyOn(component, 'updateMembersStatistics');
    spyOn(component, 'getTeamCategories');
    component.ngOnInit();
    expect(component.createDateRangeFormGroup).toHaveBeenCalled();
    expect(component.updateMembersStatistics).toHaveBeenCalled();
    expect(component.getTeamCategories).toHaveBeenCalled();
  });

  it('should call updateMembersList() and update displaySpinner to be true when updateMembersStatistics calls', () => {
    spyOn(component, 'updateMembersList');
    component.updateMembersStatistics();
    expect(component.displaySpinner).toBeTruthy();
    expect(component.updateMembersList).toHaveBeenCalledWith(membersData);
  });

  it('should update values filterString, displaySpinner and filterData when updateMembersList calls', () => {
    component.updateMembersList(membersData);
    expect(component.filterString).toBe('');
    expect(component.displaySpinner).toBeFalsy();
    expect(component.filterData[0].member.fullName).toBe('test member 1');
  });

  it('should set the form and to date when createDateRangeFormGroup calls', () => {
    component.dateService.selectedDateRange.dateFrom = new Date('2019-02-01T00:00:00.000Z');
    component.dateService.selectedDateRange.dateTo = new Date('2019-03-03T00:00:00.000Z');
    component.createDateRangeFormGroup();
    expect(component.dateRangeFormGroup.value.dateFrom).toBe(new Date('2019-02-01T00:00:00.000Z').toISOString());
    expect(component.dateRangeFormGroup.value.dateTo).toBe(new Date('2019-03-03T00:00:00.000Z').toISOString());
  });

  it('should update dateFrom and dateTo values and call updateMembersList when dateRangeChange calls ', () => {
    component.dateRangeFormGroup.value.dateFrom = '2019-02-01T00:00:00.000Z';
    component.dateRangeFormGroup.value.dateTo = '2019-03-03T00:00:00.000Z';
    spyOn(component, 'updateMembersList');
    component.dateRangeChange();
    expect(component.updateMembersList).toHaveBeenCalledWith(membersData);
    expect(component.dateRangeFormGroup.value.dateFrom).toEqual(new Date('2019-02-01T00:00:00.000Z'));
    expect(component.dateRangeFormGroup.value.dateTo).toEqual(new Date('2019-03-03T00:00:00.000Z'));
  });

  it('should return a filter value when applyFilter calls with search value', () => {
    component.membersList = membersData;
    component.applyFilter('test');
    expect(component.filterData[0].member.fullName).toBe('test member 1');
    expect(component.filterData[1].member.fullName).toBe('test member 2');
  });

  it('should update categoriesList, selectedCategory and categoryId when getTeamCategories calls', () => {
    component.getTeamCategories();
    expect(component.categoriesList.length).toBe(1);
    expect(component.selectedCategory).toBe('all');
    expect(component.categoryId).toBe(null);
  });

  it('should update selectedCategory to be `all` and categoryId to be `nulll` when calls filterByCategory with `all`', () => {
    component.filterByCategory('all');
    expect(component.selectedCategory).toBe('all');
    expect(component.categoryId).toBe(null);
  });

  it('should call updateMembersList() with Array<MpMember> when getMemberByDateAndCategoryId calls and server returns success', () => {
    spyOn(component, 'updateMembersList');
    component.getMemberByDateAndCategoryId();
    expect(component.updateMembersList).toHaveBeenCalledWith(membersData);
  });

  it('should call modalController.create() when openDetailsModal calls', () => {
    spyOn(component.modalController, 'create').and.returnValue({
      onWillDismiss: () => new Promise(null),
      present: () => {}
    });
    const member = {
      actionType: 'cancel',
      memberId: 1
    };
    component.openDetailsModal(member);
    expect(component.modalController.create).toHaveBeenCalled();
  });
});
