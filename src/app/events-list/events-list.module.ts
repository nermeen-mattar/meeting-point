import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { EventsListPage } from './events-list.page';
import { SharedModule } from '../shared/shared.module';
import { MemberDetailsComponent } from '../shared/components/member-details/member-details.component';

const routes: Routes = [
  {
    path: '',
    component: EventsListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild()
  ],
  entryComponents: [MemberDetailsComponent],
  declarations: [EventsListPage]
})
export class EventsListPageModule {}
