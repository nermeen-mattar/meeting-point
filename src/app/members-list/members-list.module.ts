import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MembersListPage } from './members-list.page';
import { TranslateModule } from '@ngx-translate/core';
import { AddMemberComponent } from './components/add-member/add-member.component';
import { MemberDetailsComponent } from './components/member-details/member-details.component';
import { MemberDetailsPopoverComponent } from './components/member-details/member-details-popover/member-details-popover.component';

const routes: Routes = [
  {
    path: '',
    component: MembersListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ],
  entryComponents: [AddMemberComponent, MemberDetailsComponent, MemberDetailsPopoverComponent],
  declarations: [MembersListPage, AddMemberComponent, MemberDetailsComponent, MemberDetailsPopoverComponent],
  exports: [AddMemberComponent]
})
export class MembersListPageModule { }
