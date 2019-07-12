import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpRequestsService } from '../../core/services/http-requests.service';
import { HttpRequestsServiceMock } from '../../shared/mocks/services/http-requests.service.mock';
import { UserServiceMock } from '../../shared/mocks/services/user.serivce.mock';
import { UserService } from '../../core/services/user.service';

import { AuthService } from './auth.service';
import { UserMessagesService } from '../../core/services/user-messages.service';
import { LoginStatusServiceMock } from '../../shared/mocks/services/login-status.service.mock';
import { LoginStatusService } from './login-status.service';
import { TranslateModule } from '@ngx-translate/core';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: HttpRequestsService,
          useClass: HttpRequestsServiceMock
        },
        {
          provide: UserMessagesService,
          useClass: UserServiceMock
        },
        {
          provide: UserService,
          useClass: UserServiceMock
        },
        {
          provide: LoginStatusService,
          useClass: LoginStatusServiceMock
        }
      ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot()
      ]
    });
  });

  it('should be created', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
