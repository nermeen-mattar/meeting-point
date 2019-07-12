import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { SendReminderComponent } from './components/send-reminder/send-reminder.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

@Component({
  selector: 'mp-user-settings',
  templateUrl: './user-settings.page.html',
  styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit {

  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() {
  }

  /**
   * @author Syed Saad Qamar
   * @description Open model and displays curent and new password input.
  */
  async changePasswordModal() {
    const modal = await this.modalController.create({
      component: ChangePasswordComponent
    });
    modal.present();
  }

  /**
   * @author Syed Saad Qamar
   * @description Open model and displays select team and toggle for reminder.
  */
  async sendReminderModal() {
    const modal = await this.modalController.create({
      component: SendReminderComponent
    });
    modal.present();
  }

  /**
   * @author Syed Saad Qamar
   * @description Open model and displays select user details inputs.
  */
  async userDetailsModal() {
    const modal = await this.modalController.create({
      component: UserDetailsComponent
    });
    modal.present();
  }
}
