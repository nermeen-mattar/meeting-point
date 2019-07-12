import { NavParams, AlertController, ModalController, IonicModule, PopoverController } from '@ionic/angular';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

import { membersData, MembersServiceMock } from '../../../../shared/mocks/services/members.service.mock';
import { MemberDetailsPopoverComponent } from './member-details-popover.component';
import { MembersService } from 'src/app/core/services/members.service';
import { LocalizedAlertServiceMock } from 'src/app/shared/mocks/services/localized-alert.service.mock';
import { LocalizedAlertService } from 'src/app/core/services/localized-alert.service';

describe('MemberDetailsPopoverComponent', () => {
  let component: MemberDetailsPopoverComponent;
  let fixture: ComponentFixture<MemberDetailsPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        AlertController,
        ModalController,
        PopoverController,
        { provide: LocalizedAlertService, useClass: LocalizedAlertServiceMock },
        { provide: NavParams, useValue: { data: { member_details : membersData[0] } }},
        {
          provide: MembersService,
          useClass: MembersServiceMock
        }
      ],
      declarations: [ MemberDetailsPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberDetailsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should memberDetails updated and isAdmin to be true when ngOnInit calls', () => {
    component.ngOnInit();
    expect(component.memberDetails).toEqual(membersData[0]);
    expect(component.isAdmin).toBeTruthy();
  });

  it('should call localizedAlertService.displayLocalizedAlert() when editRoles calls', () => {
    spyOn(component.localizedAlertService, 'displayLocalizedAlert');
    component.editRoles();
    expect(component.localizedAlertService.displayLocalizedAlert).toHaveBeenCalled();
  });

  it('should call popoverController.dismiss(), modalController.dismiss() when deleteMemberFormTeam calls', () => {
    spyOn(component.popoverController, 'dismiss');
    spyOn(component.modalController, 'dismiss');
    component.deleteMemberFormTeam();
    expect(component.popoverController.dismiss).toHaveBeenCalled();
    expect(component.modalController.dismiss).toHaveBeenCalled();
  });

  it('should call popoverController.dismiss() and memberDetails.active value to be false when changeMemberActivationStatus calls', () => {
    component.memberDetails = membersData[0];
    spyOn(component.popoverController, 'dismiss');
    component.memberDetails.active = true;
    component.changeMemberActivationStatus();
    expect(component.memberDetails.active).toBeFalsy();
    expect(component.popoverController.dismiss).toHaveBeenCalledWith(membersData[0]);
  });

  it('should call popoverController.dismiss() when makeAdmin calls and server returns success', () => {
    component.memberDetails.active = true;
    component.memberDetails = membersData[0];
    spyOn(component.popoverController, 'dismiss');
    component.makeAdmin();
    expect(component.memberDetails.active).toBeFalsy();
    expect(component.popoverController.dismiss).toHaveBeenCalledWith(membersData[0]);
  });

  it('should call popoverController.dismiss() and isAdmin to be false when makeAdmin calls and server returns error', () => {
      inject([MembersService], (service: MembersServiceMock) => {
      component.isAdmin = true;
      component.memberDetails = membersData[0];
      spyOn(component.popoverController, 'dismiss');
      service.makeAdminError = true;
      component.makeAdmin();
      expect(component.isAdmin).toBeFalsy();
      expect(component.popoverController.dismiss).toHaveBeenCalled();
    });
  });

  it('should call popoverController.dismiss() when removeAdmin calls and server returns success', () => {
    component.memberDetails.active = true;
    component.memberDetails = membersData[0];
    spyOn(component.popoverController, 'dismiss');
    component.removeAdmin();
    expect(component.memberDetails.active).toBeFalsy();
    expect(component.popoverController.dismiss).toHaveBeenCalledWith(membersData[0]);
  });

  it('should call popoverController.dismiss() and isAdmin to be false when removeAdmin calls and server returns error', () => {
    inject([MembersService], (service: MembersServiceMock) => {
      component.isAdmin = true;
      component.memberDetails = membersData[0];
      spyOn(component.popoverController, 'dismiss');
      service.removeAdminError = true;
      component.removeAdmin();
      expect(component.isAdmin).toBeFalsy();
      expect(component.popoverController.dismiss).toHaveBeenCalled();
    });
  });
});
