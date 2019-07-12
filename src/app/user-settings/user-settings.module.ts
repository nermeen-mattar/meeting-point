import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserSettingsPage } from './user-settings.page';
import { TranslateModule } from '@ngx-translate/core';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { SharedModule } from '../shared/shared.module';
import { SendReminderComponent } from './components/send-reminder/send-reminder.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { TimezoneSelectorComponent } from '../shared/components/timezone-selector/timezone-selector.component';

const routes: Routes = [
  {
    path: '',
    component: UserSettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SharedModule
  ],
  entryComponents: [UserSettingsPage, ChangePasswordComponent, SendReminderComponent, UserDetailsComponent, TimezoneSelectorComponent],
  declarations: [UserSettingsPage, ChangePasswordComponent, SendReminderComponent, UserDetailsComponent]
})
export class UserSettingsPageModule {}
