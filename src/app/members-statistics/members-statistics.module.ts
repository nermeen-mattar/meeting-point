import { NgModule, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MembersStatisticsPage } from './members-statistics.page';
import { TranslateModule } from '@ngx-translate/core';
import { MemberStatisticsDetailsComponent } from './components/member-statistics-details/member-statistics-details.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MembersStatisticsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    SharedModule
  ],
  entryComponents: [MemberStatisticsDetailsComponent],
  declarations: [MembersStatisticsPage, MemberStatisticsDetailsComponent]
})
export class MembersStatisticsPageModule {}
