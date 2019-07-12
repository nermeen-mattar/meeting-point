import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSettingsPage } from './user-settings.page';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { MembersService } from '../core/services/members.service';
import { MembersServiceMock, membersData } from '../shared/mocks/services/members.service.mock';
import { TeamsService } from '../core/services/teams.service';
import { TeamsServiceMock } from '../shared/mocks/services/teams.service.mock';
import { UserService } from '../core/services/user.service';
import { UserServiceMock } from '../shared/mocks/services/user.serivce.mock';
import { LocalizedAlertService } from '../core/services/localized-alert.service';
import { LocalizedAlertServiceMock } from '../shared/mocks/services/localized-alert.service.mock';
import { FieldValidatorsService } from '../core/services/field-validators.service';
import { FieldValidatorsMockService } from '../shared/mocks/services/field-validators.service.mock';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('UserSettingsPage', () => {
  let component: UserSettingsPage;
  let fixture: ComponentFixture<UserSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSettingsPage ],
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
          provide: TeamsService,
          useClass: TeamsServiceMock
        },
        {
          provide: UserService,
          useClass: UserServiceMock
        },
        {
          provide: LocalizedAlertService,
          useClass: LocalizedAlertServiceMock
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
    fixture = TestBed.createComponent(UserSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update currentMember and teamsService.selectedTeamId when ngOnInit calls', () => {
    component.ngOnInit();
    expect(component.currentMember).toEqual(membersData[0]);
    expect(component.selectedTeamId).toBe(1);
  });

  it('should call fieldValidatorsService.getValidator() when createBasicSettingsForm() calls', () => {
    spyOn(component.fieldValidatorsService, 'getValidator');
    component.createBasicSettingsForm();
    expect(component.fieldValidatorsService.getValidator).toHaveBeenCalledWith('number');
  });

  it('should call localizedAlertService.displayLocalizedAlert when confirmModal calls', () => {
    spyOn(component.localizedAlertService, 'displayLocalizedAlert');
    component.confirmModal();
    expect(component.localizedAlertService.displayLocalizedAlert).toHaveBeenCalled();
  });

  it('should create modal controller when changePasswordModal calls', () => {
    spyOn(component.modalController, 'create').and.returnValue({
      onWillDismiss: () => new Promise(null),
      present: () => {}
    });
    component.changePasswordModal();
    expect(component.modalController.create).toHaveBeenCalled();
  });

  it('should not call membersService.updateMember when saveMemberBasicInfoSettings calls', () => {
    spyOn(component.membersService, 'updateMember');
    component.saveMemberBasicInfoSettings();
    expect(component.membersService.updateMember).not.toHaveBeenCalled();
  });

  it('should call memberBasicSettingsGroup.get when deletePropertyValueIfNotTouched calls', () => {
    spyOn(component.memberBasicSettingsGroup, 'get').and.returnValue({
      untouched: true
    });
    component.deletePropertyValueIfNotTouched('firstName', '123');
    expect(component.memberBasicSettingsGroup.get).toHaveBeenCalledWith('firstName');
  });
});
