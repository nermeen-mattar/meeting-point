import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { NavParams } from '@ionic/angular';

import { EventsServiceMock } from '../../mocks/services/events.service.mock';
import { EventDetailsComponent } from './event-details.component';
import { SharedModule } from '../../shared.module';
import { MembersServiceMock } from '../../mocks/services/members.service.mock';
import { TeamsServiceMock } from '../../mocks/services/teams.service.mock';
import { TeamsService } from '../../../core/services/teams.service';
import { EventsService } from '../../../core/services/events.service';
import { MembersService } from '../../../core/services/members.service';
import { NavParamsMock } from '../../mocks/services/nav-params.mock';

describe('EventDetailsComponent', () => {
  let component: EventDetailsComponent;
  let fixture: ComponentFixture<EventDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventDetailsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // NO_ERRORS_SCHEMA not needed
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
        RouterTestingModule,
        SharedModule
      ],
      providers: [
        {
          provide: NavParams,
          useClass: NavParamsMock
        },
        {
        provide: EventsService,
        useClass: EventsServiceMock
      }, {
        provide: MembersService,
        useClass: MembersServiceMock
      }, {
        provide: TeamsService,
        useClass: TeamsServiceMock
      }]
    },
    )
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
