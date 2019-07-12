import { TestBed, inject } from '@angular/core/testing';

import { TeamsService } from './teams.service';
import { HttpRequestsService } from './http-requests.service';
import { HttpRequestsServiceMock } from '../../shared/mocks/services/http-requests.service.mock';

describe('TeamsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TeamsService,
        {
          provide: HttpRequestsService,
          useClass: HttpRequestsServiceMock
        }
      ]
    });
  });

  it('should be created', inject([TeamsService], (service: TeamsService) => {
    expect(service).toBeTruthy();
  }));
});
