import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordComponent } from './change-password.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MembersService } from 'src/app/core/services/members.service';
import { MembersServiceMock } from 'src/app/shared/mocks/services/members.service.mock';
import { LoginStatusService } from 'src/app/core/services/login-status.service';
import { LoginStatusServiceMock } from 'src/app/shared/mocks/services/login-status.service.mock';
import { FieldValidatorsService } from 'src/app/core/services/field-validators.service';
import { FieldValidatorsMockService } from 'src/app/shared/mocks/services/field-validators.service.mock';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        {
          provide: MembersService,
          useClass: MembersServiceMock
        },
        {
          provide: LoginStatusService,
          useClass: LoginStatusServiceMock
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
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createChangePasswordForm() when onInit calls', () => {
    spyOn(component, 'createChangePasswordForm');
    component.ngOnInit();
    expect(component.createChangePasswordForm).toHaveBeenCalled();
  });

  it('should call modalController.dismiss() when closeModal calls', () => {
    spyOn(component.modalController, 'dismiss');
    component.closeModal();
    expect(component.modalController.dismiss).toHaveBeenCalled();
  });

  it('should call loginStatusService.logout() and closeModal when changePassword calls', () => {
    spyOn(component.loginStatusService, 'logout');
    spyOn(component, 'closeModal');
    component.changePassword();
    expect(component.loginStatusService.logout).toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalled();
  });
});
