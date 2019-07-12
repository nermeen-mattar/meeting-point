import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavParams, AlertController } from '@ionic/angular';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SharedModule } from './../../../shared/shared.module';
import { ManageTeamComponent } from './manage-team.component';
import { TeamsService } from 'src/app/core/services/teams.service';
import { TeamsServiceMock, team, categories } from 'src/app/shared/mocks/services/teams.service.mock';
import { LocalizedAlertService } from 'src/app/core/services/localized-alert.service';
import { LocalizedAlertServiceMock } from 'src/app/shared/mocks/services/localized-alert.service.mock';

describe('ManageTeamComponent', () => {
  let component: ManageTeamComponent;
  let fixture: ComponentFixture<ManageTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTeamComponent ],
      imports: [
        IonicModule,
        RouterTestingModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      providers: [
        ModalController,
        AlertController,
        { provide: NavParams, useValue: {
          data: {
          team : team[0]
        }}},
        {
          provide: TeamsService,
          useClass: TeamsServiceMock
        },
        { provide: LocalizedAlertService, useClass: LocalizedAlertServiceMock },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should editMode to be true and call getTeamCategories when component initialize', () => {
    spyOn(component, 'getTeamCategories');
    component.ngOnInit();
    expect(component.editMode).toBeTruthy();
    expect(component.getTeamCategories).toHaveBeenCalled();
  });

  it('should call modalController.dismiss when closeModal calls', () => {
    spyOn(component.modalController, 'dismiss');
    component.closeModal();
    expect(component.modalController.dismiss).toHaveBeenCalled();
  });

  it('should call modalController.dismiss and router.navigateByUrl when manageFormSubmit calls and editMode false and backend returns\
   success', () => {
    component.editMode = false;
    spyOn(component.modalController, 'dismiss');
    spyOn(component.router, 'navigateByUrl');
    component.manageFormSubmit();
    expect(component.modalController.dismiss).toHaveBeenCalled();
    expect(component.router.navigateByUrl).toHaveBeenCalled();
  });

  it('should call modalController.dismiss and router.navigateByUrl when manageFormSubmit calls and editMode true and backend returns\
   success', () => {
    component.editMode = true;
    spyOn(component.modalController, 'dismiss');
    spyOn(component.router, 'navigateByUrl');
    component.manageFormSubmit();
    expect(component.modalController.dismiss).toHaveBeenCalled();
    expect(component.router.navigateByUrl).toHaveBeenCalled();
  });

  it('should update categoriesList and displaySpinner when getTeamCategories calls', () => {
    component.getTeamCategories();
    expect(component.categoriesList).toEqual(categories);
    expect(component.displaySpinner).toBeFalsy();
  });

  it('should call localizedAlertService.displayLocalizedAlert() when editCategory calls', () => {
    spyOn(component.localizedAlertService, 'displayLocalizedAlert');
    component.editCategory(categories[0]);
    expect(component.localizedAlertService.displayLocalizedAlert).toHaveBeenCalled();
  });

  it('should call localizedAlertService.displayLocalizedAlert() when deleteCategory calls', () => {
    spyOn(component.localizedAlertService, 'displayLocalizedAlert');
    component.deleteCategory(categories[0].id);
    expect(component.localizedAlertService.displayLocalizedAlert).toHaveBeenCalled();
  });
});
