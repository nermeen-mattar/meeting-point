import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { StringNormalizerPipe } from './pipes/string-normalizer/string-normalizer.pipe';
import { LocalizedTextModifierPipe } from './pipes/localized-text-modifier/localized-text-modifier.pipe';
import { NewPasswordComponent } from './components/new-password/new-password.component';
import { GetLocalTimePipe } from './pipes/get-local-time/get-local-time.pipe';
import { TimezoneSelectorComponent } from './components/timezone-selector/timezone-selector.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { SearchUserPipe } from './pipes/search-user/search-user.pipe';
import { MemberDetailsComponent } from './components/member-details/member-details.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    StringNormalizerPipe,
    LocalizedTextModifierPipe,
    NewPasswordComponent,
    GetLocalTimePipe,
    TimezoneSelectorComponent,
    TermsAndConditionsComponent,
    EventDetailsComponent,
    SearchUserPipe,
    MemberDetailsComponent
  ],
  entryComponents: [
    EventDetailsComponent,
    MemberDetailsComponent
  ],
  exports: [
    LocalizedTextModifierPipe,
    StringNormalizerPipe,
    NewPasswordComponent,
    GetLocalTimePipe,
    TimezoneSelectorComponent,
    EventDetailsComponent,
    SearchUserPipe,
    MemberDetailsComponent
  ]
})
export class SharedModule { }
