import { TestBed, inject } from '@angular/core/testing';

import { LoginStatusService } from './login-status.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginStatusService],
      imports: [RouterTestingModule]
    });
  });

  it('should be created', inject([LoginStatusService], (service: LoginStatusService) => {
    expect(service).toBeTruthy();
  }));
});
