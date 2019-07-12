import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { AddMemberComponent } from './add-member.component';
import { NavParams, IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MembersService } from '../../../core/services/members.service';
import { MembersServiceMock } from '../../../shared/mocks/services/members.service.mock';

describe('AddMemberComponent', () => {
  let component: AddMemberComponent;
  let fixture: ComponentFixture<AddMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild([]),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        { provide: NavParams, useValue: { get: () => 2 }},
        {
          provide: MembersService,
          useClass: MembersServiceMock
        }
      ],
      declarations: [ AddMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getEmailFormGroup() when addEmailField calls', () => {
    spyOn(component.addEmailForm, 'get').and.returnValue({
      push: () => {}
    });
    component.addEmailField();
    expect(component.addEmailForm.get).toHaveBeenCalledWith('emails');
  });

  it('should delete the addEmailForm value when removeEmailField calls', () => {
    component.addEmailForm.get('emails')['controls'] = [1, 2, 3];
    component.removeEmailField(1);
    expect(component.addEmailForm.get('emails')['controls'].length).toBe(2);
  });

  it('should call membersService.createMember() when addMembersToTeam calls', () => {
    spyOn(component.modalController, 'dismiss');
    component.addMembersToTeam();
    expect(component.modalController.dismiss).toHaveBeenCalled();
  });

  it('should call modalController.dismiss() when closeModal calls', () => {
    spyOn(component.modalController, 'dismiss');
    component.closeModal();
    expect(component.modalController.dismiss).toHaveBeenCalled();
  });
});
