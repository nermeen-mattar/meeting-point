import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TeamsListPage } from './teams-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { TeamsListPopoverComponent } from './components/teams-list-popover/teams-list-popover.component';
import { ManageTeamComponent } from './components/manage-team/manage-team.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: TeamsListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    SharedModule
  ],
  entryComponents: [TeamsListPopoverComponent, ManageTeamComponent],
  declarations: [TeamsListPage, TeamsListPopoverComponent, ManageTeamComponent]
})
export class TeamsListPageModule {}
