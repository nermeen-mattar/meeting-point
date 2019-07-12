import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLogsPage } from './team-logs.page';
import { TranslateModule } from '@ngx-translate/core';
import { TeamsService } from '../core/services/teams.service';
import { TeamsServiceMock } from '../shared/mocks/services/teams.service.mock';

describe('TeamLogsPage', () => {
  let component: TeamLogsPage;
  let fixture: ComponentFixture<TeamLogsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [ TeamLogsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [

        {
          provide: TeamsService,
          useClass: TeamsServiceMock
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamLogsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
