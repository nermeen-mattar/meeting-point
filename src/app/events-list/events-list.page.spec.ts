import { RouterTestingModule } from '@angular/router/testing';
import { AlertController, ModalController, IonList, IonToggle } from '@ionic/angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

import { EventsListPage } from './events-list.page';
import { EventsService } from '../core/services/events.service';
import { EventsServiceMock, eventData } from '../shared/mocks/services/events.service.mock';
import { UserService } from '../core/services/user.service';
import { UserServiceMock } from '../shared/mocks/services/user.serivce.mock';
import { TeamsService } from '../core/services/teams.service';
import { TeamsServiceMock } from '../shared/mocks/services/teams.service.mock';
import { ModalControllerMock } from './../shared/mocks/services/modal-controller.mock';
import { LocalizedAlertService } from '../core/services/localized-alert.service';
import { LocalizedAlertServiceMock } from '../shared/mocks/services/localized-alert.service.mock';

describe('EventsListPage', () => {
  let component: EventsListPage;
  let fixture: ComponentFixture<EventsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsListPage ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        AlertController,
        {
          provide: ModalController,
          useClass: ModalControllerMock
        },
        {
          provide: EventsService,
          useClass: EventsServiceMock
        },
        {
          provide: UserService,
          useClass: UserServiceMock
        },
        {
          provide: TeamsService,
          useClass: TeamsServiceMock
        },
        {
          provide: LocalizedAlertService,
          useClass: LocalizedAlertServiceMock
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should update the variables and call updateEvents when initialize the component', () => {
    spyOn(component, 'updateTeamRoles');
    spyOn(component, 'updateEvents');
    spyOn(component, 'updateCategories');
    component.ionViewDidEnter();
    expect(component.userTeams.length).toBe(1);
    expect(component.selectedTeamId).toBe(1);
    expect(component.updateTeamRoles).toHaveBeenCalled();
    expect(component.updateEvents).toHaveBeenCalled();
    expect(component.updateCategories).toHaveBeenCalled();
  });

  it(`should have isTeamMember and isTeamAdmin set to true when updateTeamRoles method is called`, async () => {
    component.updateTeamRoles();
    expect(component.isTeamMember).toBeTruthy();
    expect(component.isTeamAdmin).toBeTruthy();
  });

  it(`should teamsService.selectedTeamId be 1, should update events variable when updateEvents is called`, async () => {
    component.updateEvents();
    expect(component.events.length).toBe(1);
  });


  it('should find event index in events variable based on the eventId'
  , async () => {
    component.events = eventData.events;
    expect(component.getIndexOfTargetEvent(1)).toBe(0);
  });

  it('should have history button by default', async () => {
    const app = fixture.nativeElement;
    const buttons = app.querySelectorAll('ion-button');
    expect(buttons[0].textContent).toContain('EVENT.HISTORY');
  });

  it('should have `isPastEvent` set to `false`, `toggle` set to `enabled`, and should have history button shown when displayFutureEvents\
  method is called', async () => {
    spyOn(component, 'updateEvents');
    component.displayFutureEvents();
    expect(component.isPastEvents).toBeFalsy();
    expect(component.updateEvents).toHaveBeenCalled();
  });

  it('should isPastEvent is true, toggle is disabled, and should have back button when displayPastEvents is called', async () => {
    spyOn(component, 'updateEvents');
    component.displayPastEvents();
    expect(component.isPastEvents).toBeTruthy();
    expect(component.updateEvents).toHaveBeenCalled();
  });

  it('should update the component.teamsService.selectedTeamId when changeSelectedTeam is called to be equal to selectedTeamId variable'
  , async () => {
    spyOn(component, 'updateEvents');
    component.selectedTeamId = 2;
    component.changeSelectedTeam();
    expect(component.teamsService.selectedTeamId).toEqual(component.selectedTeamId);
  });

  it('should change the event.myParticipation.action when toggleParticipationInEvent is called'
  , async () => {
    await fixture.detectChanges();
    const app = fixture.nativeElement;
    component.events = eventData.events;
    const toggles = {
      checked: true
    };
    component.toggleParticipationInEvent(1, toggles);
    expect(component.events[0].myParticipation.action).toEqual('participate');
  });

});

