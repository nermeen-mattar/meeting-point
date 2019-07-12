import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { TeamsListPopoverComponent } from './teams-list-popover.component';
import { IonicModule, NavParams, AlertController, ModalController } from '@ionic/angular';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { MembersService } from 'src/app/core/services/members.service';
import { MembersServiceMock } from 'src/app/shared/mocks/services/members.service.mock';
import { TeamsService } from 'src/app/core/services/teams.service';
import { TeamsServiceMock, team } from 'src/app/shared/mocks/services/teams.service.mock';
import { UserService } from 'src/app/core/services/user.service';
import { UserServiceMock } from 'src/app/shared/mocks/services/user.serivce.mock';
import { LocalizedAlertService } from 'src/app/core/services/localized-alert.service';
import { LocalizedAlertServiceMock } from 'src/app/shared/mocks/services/localized-alert.service.mock';

describe('TeamsListPopoverComponent', () => {
  let component: TeamsListPopoverComponent;
  let fixture: ComponentFixture<TeamsListPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamsListPopoverComponent ],
      imports: [
        IonicModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        AlertController,
        ModalController,
        { provide: NavParams, useValue: { data: {
          team : team[0],
          hasAdminRole: true,
          hasMemberRole: false
        }}},
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
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsListPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update team and isAdmin to be true when ngOnInit calls', () => {
    expect(component.team.id).toBe(1);
    expect(component.isAdmin).toBeTruthy();
  });

  it('should call localizedAlertService.displayLocalizedAlert() when editMyRoles calls', () => {
    spyOn(component.localizedAlertService, 'displayLocalizedAlert');
    component.editMyRoles();
    expect(component.localizedAlertService.displayLocalizedAlert).toHaveBeenCalled();
  });

  it('should call popoverController.dismiss() when makeAdmin calls and server returns success', () => {
    spyOn(component.popoverController, 'dismiss');
    component.makeAdmin();
    expect(component.navParams.data.hasAdminRole).toBeFalsy();
    expect(component.popoverController.dismiss).toHaveBeenCalled();
  });

  it('should call popoverController.dismiss() and isAdmin to be false when makeAdmin calls and server returns error', () => {
      inject([MembersService], (service: MembersServiceMock) => {
      component.isAdmin = true;
      service.makeAdminError = true;
      spyOn(component.popoverController, 'dismiss');
      component.makeAdmin();
      expect(component.isAdmin).toBeFalsy();
      expect(component.popoverController.dismiss).toHaveBeenCalled();
    });
  });

  it('should call popoverController.dismiss() when removeAdminRole calls and server returns success', () => {
    spyOn(component.popoverController, 'dismiss');
    component.removeAdminRole();
    expect(component.popoverController.dismiss).toHaveBeenCalled();
  });

  it('should call popoverController.dismiss() and isAdmin to be false when removeAdminRole calls and server returns error', () => {
    inject([MembersService], (service: MembersServiceMock) => {
      component.isAdmin = true;
      spyOn(component.popoverController, 'dismiss');
      service.removeAdminError = true;
      component.removeAdminRole();
      expect(component.isAdmin).toBeFalsy();
      expect(component.popoverController.dismiss).toHaveBeenCalled();
    });
  });

  it('should call localizedAlertService.displayLocalizedAlert() when confirmModel calls', () => {
    spyOn(component.localizedAlertService, 'displayLocalizedAlert');
    component.confirmModel(true);
    expect(component.localizedAlertService.displayLocalizedAlert).toHaveBeenCalled();
  });

  it('should call popoverController.dismiss() when deleteTeam calls', () => {
    spyOn(component.alertController, 'dismiss');
    spyOn(component.popoverController, 'dismiss');
    component.deleteTeam();
    expect(component.alertController.dismiss).toHaveBeenCalled();
    expect(component.popoverController.dismiss).toHaveBeenCalled();
  });

  it('should call popoverController.dismiss() when leaveTeamMemberRole calls', () => {
    spyOn(component.alertController, 'dismiss');
    spyOn(component.popoverController, 'dismiss');
    component.leaveTeamMemberRole();
    expect(component.alertController.dismiss).toHaveBeenCalled();
    expect(component.popoverController.dismiss).toHaveBeenCalled();
  });

  it('should call modalController.create when openManageTeamModal calls', () => {
    spyOn(component.modalController, 'create').and.returnValue({
      onWillDismiss: () => new Promise(null),
      present: () => {}
    });
    component.editTeamModal();
    expect(component.modalController.create).toHaveBeenCalled();
  });
});
