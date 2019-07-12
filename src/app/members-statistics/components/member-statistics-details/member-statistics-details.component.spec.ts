import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberStatisticsDetailsComponent } from './member-statistics-details.component';
import { NavParams, AlertController, ModalController, IonicModule } from '@ionic/angular';
import { membersData } from 'src/app/shared/mocks/services/members.service.mock';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TeamsServiceMock } from 'src/app/shared/mocks/services/teams.service.mock';
import { TeamsService } from 'src/app/core/services/teams.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MembersStatisticsService } from 'src/app/core/services/members-statistics.service';
import { MembersStatisticsServiceMock } from 'src/app/shared/mocks/services/member-statistics.service.mock';
import { EventsService } from 'src/app/core/services/events.service';
import { EventsServiceMock, eventData } from 'src/app/shared/mocks/services/events.service.mock';
import { SharedModule } from 'src/app/shared/shared.module';
import { DateService } from 'src/app/core/services/date.service';
import { DateServiceMock } from 'src/app/shared/mocks/services/date.service.mock';

describe('MemberStatisticsDetailsComponent', () => {
  let component: MemberStatisticsDetailsComponent;
  let fixture: ComponentFixture<MemberStatisticsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule,
        SharedModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        ModalController,
        { provide: NavParams, useValue: {
          data: {
            member: {
              actionType: 'participate',
              memberId: 1
            }
          }
        }},
        {
          provide: MembersStatisticsService,
          useClass: MembersStatisticsServiceMock
        },
        {
          provide: EventsService,
          useClass: EventsServiceMock
        },
        {
          provide: TeamsService,
          useClass: TeamsServiceMock
        },
        {
          provide: DateService,
          useClass: DateServiceMock
        },
      ],
      declarations: [ MemberStatisticsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberStatisticsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should memberId=1, actionType=`participate`, update dateRange and updateMemberDetailsStatistics call when ngOnInit calls', () => {
    component.dateService.selectedDateRange.dateFrom = new Date('2019-02-01T00:00:00.000Z');
    component.dateService.selectedDateRange.dateTo = new Date('2019-03-03T00:00:00.000Z');
    component.ngOnInit();
    expect(component.memberId).toBe(1);
    expect(component.actionType).toBe('participate');
    expect(component.dateRange.dateFrom).toEqual(new Date('2019-02-01T00:00:00.000Z'));
    expect(component.dateRange.dateTo).toEqual(new Date('2019-03-03T00:00:00.000Z'));
  });

  it('should call modalController.dismiss() when closeModal calls', () => {
    spyOn(component.modalController, 'dismiss');
    component.closeModal();
    expect(component.modalController.dismiss).toHaveBeenCalled();
  });

  it(`should update the values email, numberOfRecords, member, displaySpinner to be false and addNumOfParticipationsToEvents() call
      when updateMemberDetailsStatistics calls and server returns success`, () => {
    spyOn(component.eventsService, 'addNumOfParticipationsToEvents');
    component.updateMemberDetailsStatistics();
    expect(component.email).toBe('test@gmail.com');
    expect(component.numberOfRecords).toBe(7);
    expect(component.member).toBe('meeting-point');
    expect(component.eventsService.addNumOfParticipationsToEvents).toHaveBeenCalledWith([eventData]);
    expect(component.displaySpinner).toBeFalsy();
  });
});
