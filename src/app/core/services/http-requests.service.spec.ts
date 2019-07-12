import { TranslateModule } from '@ngx-translate/core';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpRequestsService } from './http-requests.service';
import { UserMessagesService } from './user-messages.service';
import { UserServiceMock } from '../../shared/mocks/services/user.serivce.mock';

describe('HttpRequestsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpRequestsService,
        {
          provide: UserMessagesService,
          useClass: UserServiceMock
        }
      ],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        TranslateModule.forRoot()
      ]
    });
  });

  it('should be created', inject([HttpRequestsService], (service: HttpRequestsService) => {
    expect(service).toBeTruthy();
  }));
});
