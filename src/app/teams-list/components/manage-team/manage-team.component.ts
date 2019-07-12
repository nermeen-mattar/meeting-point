import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { TeamsService } from 'src/app/core/services/teams.service';
import { Router } from '@angular/router';
import { MpCategory } from 'src/app/core/models/mp-event-category.model';
import { LocalizedAlertService } from 'src/app/core/services/localized-alert.service';

@Component({
  selector: 'mp-manage-team',
  templateUrl: './manage-team.component.html',
  styleUrls: ['./manage-team.component.scss']
})
export class ManageTeamComponent implements OnInit {

  displaySpinner = false;
  manageTeamForm: FormGroup = new FormGroup({
    teamName: new FormControl('', [Validators.required, Validators.minLength(4)]),
    cancelWithReason: new FormControl(false)
  });
  editMode: boolean;
  categoriesList: Array<MpCategory>;
  selectedTeamId: number;
  constructor(
    public modalController: ModalController,
    public teamsService: TeamsService,
    public router: Router,
    public navParams: NavParams,
    public alertController: AlertController,
    public localizedAlertService: LocalizedAlertService,
    public cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.displaySpinner = true;
    if (this.navParams.data.team) {
      this.editMode = true;
      this.teamsService.getTeam(this.navParams.data.team.teamId)
      .subscribe((teamDetails) => {
        this.manageTeamForm.controls.teamName.setValue(teamDetails.name);
        this.manageTeamForm.controls.cancelWithReason.setValue(teamDetails.cancelWithReason);
        this.selectedTeamId = this.navParams.data.team.teamId;
        this.getTeamCategories();
      });
    } else {
      this.editMode = false;
      this.displaySpinner = false;
    }
  }

  closeModal () {
    this.modalController.dismiss();
  }

  /**
   * @author Syed Saad Qamar @copied from web
   * @desc Triggers when the form with team name is submitted
   */
  manageFormSubmit() {
    this.displaySpinner = true;
    if (this.editMode) {
      this.navParams.data.team.teamName = this.manageTeamForm.value.teamName;
      const editTeamData = {
        ...this.manageTeamForm.value,
        teamId: this.navParams.data.team.teamId
      };
      this.teamsService.editTeam(editTeamData).subscribe(() => {
        this.modalController.dismiss();
        this.router.navigateByUrl('teams-list');
        this.displaySpinner = false;
      }, () => {
        this.displaySpinner = false;
      });
    } else {
      this.teamsService.addTeam(this.manageTeamForm.value.teamName).subscribe(() => {
        this.modalController.dismiss();
        this.router.navigateByUrl('teams-list');
        this.displaySpinner = false;
      }, () => {
        this.displaySpinner = false;
      });
    }
  }

   /**
    * @author Syed Saad Qamar @copied from web
    * @description get saved categories from API for selected Team
    * @param selectedTeamId
    */
  getTeamCategories() {
    this.teamsService.getCategories(this.selectedTeamId).subscribe(res => {
      this.categoriesList = res;
      this.displaySpinner = false;
      this.cdRef.detectChanges();
    }, () => {
      this.displaySpinner = false;
    });
  }

   /**
    * @author Syed Saad Qamar @copied from web
    * @description edit the target category's name from the categories list (only allowed for admin)
    * @param {MpCategory} category
    */
  async editCategory(category) {
    const editCategoryAlert = {
      header: 'EVENT.CATEGORY_NAME',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Category name',
          value: category.name
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Update',
          handler: (updatedCategory) => {
            this.displaySpinner = true;
            const categoryData = {id: category.id, name: updatedCategory.name};
            this.teamsService.updateCategory(categoryData)
            .subscribe(() => {
              this.getTeamCategories();
            }, () => {
              this.displaySpinner = false;
            });
          }
        }
      ]
    };
    this.localizedAlertService.displayLocalizedAlert(editCategoryAlert);
  }

  /**
   * @author Syed Saad Qamar
   * @description when user click on ok button the user delete from the memberList and list update and popup will close.
   */
  async deleteCategory(categoryId) {
    const deleteCategoryAlert = {
      header: 'USER_MESSAGES.TEAM.CATEGORY.CATEGORY_CONFIRM_DELETING_HEADER',
      message: 'USER_MESSAGES.TEAM.CATEGORY.CATEGORY_CONFIRM_DELETING_BODY',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Confirm',
          handler: () => {
            this.displaySpinner = true;
            this.teamsService.deleteCategory(categoryId)
            .subscribe(() => {
              this.getTeamCategories();
            }, () => {
              this.displaySpinner = false;
            });
          }
        }
      ]
    };
    this.localizedAlertService.displayLocalizedAlert(deleteCategoryAlert);
  }
}
