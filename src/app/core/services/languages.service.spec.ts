import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { LanguagesService } from './languages.service';
import { MembersService } from './members.service';
import { MembersServiceMock } from 'src/app/shared/mocks/services/members.service.mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('LanguagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TranslateModule.forRoot(),
      RouterTestingModule
    ],
    providers: [
      {
          provide: MembersService,
          useClass: MembersServiceMock
      }
    ]
  }));

  it('should be created', () => {
    const service: LanguagesService = TestBed.get(LanguagesService);
    expect(service).toBeTruthy();
  });
});
