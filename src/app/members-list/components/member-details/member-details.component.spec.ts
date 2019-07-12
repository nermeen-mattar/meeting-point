import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDetailsComponent } from './member-details.component';
import { MemberDetailsPopoverComponent } from './member-details-popover/member-details-popover.component';
import { NavParams, AlertController, ModalController, IonicModule } from '@ionic/angular';
import { membersData, MembersServiceMock } from 'src/app/shared/mocks/services/members.service.mock';
import { MembersService } from 'src/app/core/services/members.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { TeamsServiceMock } from 'src/app/shared/mocks/services/teams.service.mock';
import { TeamsService } from 'src/app/core/services/teams.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MemberDetailsComponent', () => {
  let component: MemberDetailsComponent;
  let fixture: ComponentFixture<MemberDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        AlertController,
        ModalController,
        { provide: NavParams, useValue: { data: { value : membersData[0] } }},
        {
          provide: TeamsService,
          useClass: TeamsServiceMock
        }
      ],
      declarations: [ MemberDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should displaySpinner value to be false, selectedTeamId value to be 1 when component initialize', () => {
    component.teamsService.selectedTeamId = 1;
    component.ngOnInit();
    expect(component.displaySpinner).toBeFalsy();
  });

  it('should call modalController.dismiss() when closeModal calls', () => {
    spyOn(component.modalController, 'dismiss');
    component.closeModal();
    expect(component.modalController.dismiss).toHaveBeenCalled();
  });

  it('should call popoverController.create() when showMemberDetailsPopover calls', () => {
    component.memberDetails = membersData[0];
    spyOn(component.popoverController, 'create').and.returnValue({
      onWillDismiss: () => new Promise(null),
      present: () => {}
    });
    component.showMemberDetailsPopover({});
    expect(component.popoverController.create).toHaveBeenCalledWith({
      component: MemberDetailsPopoverComponent,
      event: {},
      translucent: true,
      componentProps: {
        member_details: component.memberDetails
      }
    });
  });
});
