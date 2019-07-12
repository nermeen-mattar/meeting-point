import { TestBed } from '@angular/core/testing';

import { PingService } from './ping.service';
import { HttpRequestsService } from './http-requests.service';
import { HttpRequestsServiceMock } from 'src/app/shared/mocks/services/http-requests.service.mock';

describe('PingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: HttpRequestsService,
        useClass: HttpRequestsServiceMock
      }
    ]
  }));

  it('should be created', () => {
    const service: PingService = TestBed.get(PingService);
    expect(service).toBeTruthy();
  });
});
