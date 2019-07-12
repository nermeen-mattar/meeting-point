import { AlertController } from '@ionic/angular';
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

import { LocalizedAlertService } from './localized-alert.service';

describe('LocalizedAlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TranslateModule.forRoot()
    ],
    providers: [
      AlertController
    ],
  }));

  it('should be created', () => {
    const service: LocalizedAlertService = TestBed.get(LocalizedAlertService);
    expect(service).toBeTruthy();
  });
});
