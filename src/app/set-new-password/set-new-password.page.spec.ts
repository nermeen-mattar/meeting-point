import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { SetNewPasswordPage } from './set-new-password.page';
import { HttpRequestsService } from '../core/services/http-requests.service';
import { HttpRequestsServiceMock } from '../shared/mocks/services/http-requests.service.mock';
import { AuthService } from '../core/services/auth.service';
import { AuthServiceMock } from '../shared/mocks/services/auth.service.mock';

describe('SetNewPasswordPage', () => {
  let component: SetNewPasswordPage;
  let fixture: ComponentFixture<SetNewPasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetNewPasswordPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        {
          provide: NavController,
          useValue: {}
        },
        {
          provide: AuthService,
          useClass: AuthServiceMock
        },
        {
          provide: HttpRequestsService,
          useClass: HttpRequestsServiceMock
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetNewPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
