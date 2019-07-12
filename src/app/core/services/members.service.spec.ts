import { TestBed, inject } from '@angular/core/testing';

import { UserServiceMock } from './../../shared/mocks/services/user.serivce.mock';
import { UserService } from './../../core/services/user.service';
import { HttpRequestsService } from './../../core/services/http-requests.service';
import { MembersService } from './members.service';
import { HttpRequestsServiceMock } from '../../shared/mocks/services/http-requests.service.mock';
import { TeamsServiceMock } from '../../shared/mocks/services/teams.service.mock';
import { TeamsService } from '../../core/services/teams.service';
import { DateService } from '../../core/services/date.service';

describe('MembersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:
      [MembersService,
        {
          provide: HttpRequestsService,
          useClass: HttpRequestsServiceMock
        },
        {
          provide: UserService,
          useClass: UserServiceMock
        },
        {
          provide: TeamsService,
          useClass: TeamsServiceMock
        }, {
          provide: DateService,
          useValue: {}
        }
      ],
    });
  });

  it('should be created', inject([MembersService], (service: MembersService) => {
    expect(service).toBeTruthy();
  }));
});
