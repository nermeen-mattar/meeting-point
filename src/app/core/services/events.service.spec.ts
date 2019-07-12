import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { EventsService } from './events.service';
import { HttpRequestsService } from '../../core/services/http-requests.service';
import { UserService } from '../../core/services/user.service';
import { UserServiceMock } from '../../shared/mocks/services/user.serivce.mock';
import { HttpRequestsServiceMock } from './../../shared/mocks/services/http-requests.service.mock';

describe('EventsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventsService,
        {
          provide: HttpRequestsService,
          useClass: HttpRequestsServiceMock
        },
        {
          provide: UserService,
          useClass: UserServiceMock
        }],
      imports: [HttpClientModule, RouterTestingModule]
    });
  });

  it('should be created', inject([EventsService], (service: EventsService) => {
    expect(service).toBeTruthy();
  }));
});
