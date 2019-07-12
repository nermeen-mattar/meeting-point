import { TestBed, inject } from '@angular/core/testing';

import { HttpRequestsService } from './../../core/services/http-requests.service';
import { RegisterService } from './register.service';
import { HttpRequestsServiceMock } from '../../shared/mocks/services/http-requests.service.mock';

describe('RegisterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterService,
        {
          provide: HttpRequestsService,
          useClass: HttpRequestsServiceMock
        }]
    });
  });

  it('should be created', inject([RegisterService], (service: RegisterService) => {
    expect(service).toBeTruthy();
  }));
});
