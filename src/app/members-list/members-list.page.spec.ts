import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersListPage } from './members-list.page';
import { TeamsService } from '../core/services/teams.service';
import { TeamsServiceMock } from '../shared/mocks/services/teams.service.mock';
import { TranslateModule } from '@ngx-translate/core';
import { MembersService } from '../core/services/members.service';
import { MembersServiceMock, membersData } from '../shared/mocks/services/members.service.mock';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

describe('MembersListPage', () => {
  let component: MembersListPage;
  let fixture: ComponentFixture<MembersListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembersListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        FormsModule,
        IonicModule,
        TranslateModule.forRoot()
      ],
      providers: [
        AlertController,
        ModalController,
        {
          provide: MembersService,
          useClass: MembersServiceMock
        },
        {
          provide: TeamsService,
          useClass: TeamsServiceMock
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the variables and call updateMembers when initialize the component', () => {
    spyOn(component, 'updateMembers');
    component.ngOnInit();
    expect(component.userTeams.length).toBe(1);
    expect(component.selectedTeamId).toBe(1);
    expect(component.isTeamMember).toBeTruthy();
    expect(component.isTeamAdmin).toBeTruthy();
    expect(component.updateMembers).toHaveBeenCalled();
  });

  it(`should teamsService.selectedTeamId is 1, isTeamMember and isTeamAdmin are true
     and should call updateMembersList when updateMembers calls`, () => {
      spyOn(component, 'updateMembersList');
      spyOn(component, 'closeListSlidingItems');
      component.selectedTeamId = 1;
      component.updateMembers(true);
      expect(component.teamsService.selectedTeamId).toBe(1);
      expect(component.closeListSlidingItems).toHaveBeenCalled();
      expect(component.isTeamAdmin).toBeTruthy();
      expect(component.isTeamMember).toBeTruthy();
      expect(component.updateMembersList).toHaveBeenCalled();
  });

  it('should update membersList when updateMembersList calls', () => {
    component.updateMembersList(membersData);
    expect(component.membersList).toEqual(membersData);
  });

  it('should return a filter value when applyFilter calls with search value', () => {
    component.membersList = membersData;
    component.applyFilter('test');
    expect(component.filterData[0].member.fullName).toBe('test member 1');
    expect(component.filterData[1].member.fullName).toBe('test member 2');
  });

  it('should call modalController.create when openMemberAddModal calls', () => {
    spyOn(component.modalController, 'create').and.returnValue({
      onWillDismiss: () => new Promise(null),
      present: () => {}
    });
    component.openMemberAddModal();
    expect(component.modalController.create).toHaveBeenCalled();
  });

  it('should call alertController.create() when deleteModel calls', () => {
    spyOn(component.alertController, 'create').and.returnValue({
      present: () => {}
    });
    component.deleteModel(membersData[0], 0);
    expect(component.alertController.create).toHaveBeenCalled();
  });

  it(`should call memberDeleted() and update displaySpinner to true when deleteMember calls`, () => {
    spyOn(component, 'memberDeleted');
    spyOn(component, 'closeListSlidingItems');
    component.deleteMember(membersData[0].id, 0);
    expect(component.displaySpinner).toBeTruthy();
    expect(component.closeListSlidingItems).toHaveBeenCalled();
    expect(component.memberDeleted).toHaveBeenCalledWith(0);
  });

  it('should update a membersList and update displaySpinner to false when memberDeleted calls', () => {
    component.membersList = [...membersData];
    component.memberDeleted(0);
    expect(component.membersList.length).toBe(1);
    expect(component.displaySpinner).toBeFalsy();
  });
});
