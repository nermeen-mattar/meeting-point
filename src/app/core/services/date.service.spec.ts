import { TestBed, inject } from '@angular/core/testing';

import { DateService } from './date.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('DateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateService],
      imports: [
        RouterTestingModule
      ]
    });
  });

  it('should be created', inject([DateService], (service: DateService) => {
    expect(service).toBeTruthy();
  }));
});
