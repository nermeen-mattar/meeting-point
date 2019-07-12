import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RegisterPage } from './register.page';
import { MembersService } from '../core/services/members.service';
import { MembersServiceMock } from '../shared/mocks/services/members.service.mock';
import { AuthService } from '../core/services/auth.service';
import { AuthServiceMock } from '../shared/mocks/services/auth.service.mock';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { RegisterService } from '../core/services/register.service';
import { RegisterServiceMock } from '../shared/mocks/services/register.service.mock';
import { FieldValidatorsService } from '../core/services/field-validators.service';
import { FieldValidatorsMockService } from '../shared/mocks/services/field-validators.service.mock';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        }),
        ReactiveFormsModule,
        SharedModule
       ],
      declarations: [ RegisterPage ],
      providers: [
        {
          provide: AuthService,
          useClass: AuthServiceMock
        },
        {
          provide: RegisterService,
          useClass: RegisterServiceMock
        },
        {
          provide: MembersService,
          useClass: MembersServiceMock
        },
        {
          provide: FieldValidatorsService,
          useClass: FieldValidatorsMockService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
