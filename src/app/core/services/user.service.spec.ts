import { TestBed, inject } from '@angular/core/testing';

import { TokenHandlerService } from './token-handler.service';
import { LoginStatusService } from './login-status.service';
import { UserService } from './user.service';
import { TeamsServiceMock } from '../../shared/mocks/services/teams.service.mock';
import { TeamsService } from './teams.service';
import { HttpRequestsService } from './http-requests.service';
import { HttpRequestsServiceMock } from '../../shared/mocks/services/http-requests.service.mock';
import { LoginStatusServiceMock } from '../../shared/mocks/services/login-status.service.mock';
import { TokenHandlerServiceMock } from '../../shared/mocks/services/token-handler.service.mock';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        {
          provide: TeamsService,
          useClass: TeamsServiceMock
        },
        {
          provide: LoginStatusService,
          useClass: LoginStatusServiceMock
        },
        {
          provide: HttpRequestsService,
          useClass: HttpRequestsServiceMock
        }, {
          provide: TokenHandlerService,
          useClass: TokenHandlerServiceMock
        }
      ]
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
