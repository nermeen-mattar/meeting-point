import { TestBed, inject } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { UserMessagesService } from './user-messages.service';
import { ToastController } from '@ionic/angular';

describe('UserMessagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserMessagesService,
        ToastController
      ],
      imports: [
        TranslateModule.forRoot()
      ]
    });
  });

  it('should be created', inject([UserMessagesService], (service: UserMessagesService) => {
    expect(service).toBeTruthy();
  }));
});
