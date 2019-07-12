import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { RegisterPage } from './register.page';
import { SharedModule } from '../shared/shared.module';
import { TermsAndConditionsComponent } from '../shared/components/terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [RegisterPage],
  entryComponents: [TermsAndConditionsComponent],
})
export class RegisterPageModule {}
