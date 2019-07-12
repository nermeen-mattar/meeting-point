import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsListPage } from './teams-list.page';
import { IonicModule, PopoverController, ModalController } from '@ionic/angular';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TeamsService } from '../core/services/teams.service';
import { TeamsServiceMock, team } from '../shared/mocks/services/teams.service.mock';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('TeamsListPage', () => {
  let component: TeamsListPage;
  let fixture: ComponentFixture<TeamsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamsListPage ],
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
        ModalController,
        PopoverController,
        {
          provide: TeamsService,
          useClass: TeamsServiceMock
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateTeamList and displaySpinner to be true when ngOnInit calls', () => {
    spyOn(component, 'updateTeamList');
    component.ngOnInit();
    expect(component.displaySpinner).toBeTruthy();
    expect(component.updateTeamList).toHaveBeenCalled();
  });

  it('should updated teamRoles, userTeams and displaySpinner to be false when updateTeamList calls', () => {
    component.updateTeamList();
    expect(component.teamRoles.teamAdmins.length).toBe(11);
    expect(component.teamRoles.teamMembers.length).toBe(6);
    expect(component.displaySpinner).toBeFalsy();
  });

  it('should call popoverController.create() when showTeamsListPopover calls', () => {
    spyOn(component.popoverController, 'create').and.returnValue({
      onWillDismiss: () => new Promise(null),
      present: () => {}
    });
    component.showTeamsListPopover({}, true, false, team[0]);
    expect(component.popoverController.create).toHaveBeenCalled();
  });

  it('should return true to find teamId exist in teamAdmins when hasAdminRole calls', () => {
    expect(component.hasAdminRole(96)).toBeTruthy();
  });

  it('should return false to find teamId exist in teamMembers when hasMemberRole calls', () => {
    expect(component.hasMemberRole(123)).toBeFalsy();
  });

  it('should call modalController.create when openManageTeamModal calls', () => {
    spyOn(component.modalController, 'create').and.returnValue({
      onWillDismiss: () => new Promise(null),
      present: () => {}
    });
    component.openManageTeamModal();
    expect(component.modalController.create).toHaveBeenCalled();
  });
});
