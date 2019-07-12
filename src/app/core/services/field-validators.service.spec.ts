import { TestBed, inject } from '@angular/core/testing';

import { FieldValidatorsService } from './field-validators.service';

describe('FieldValidatorsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FieldValidatorsService]
    });
  });

  it('should be created', inject([FieldValidatorsService], (service: FieldValidatorsService) => {
    expect(service).toBeTruthy();
  }));
});
