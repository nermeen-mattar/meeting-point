import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'events-list',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: './register/register.module#RegisterPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'members-list',
    canActivate: [AuthGuard],
    loadChildren: './members-list/members-list.module#MembersListPageModule'
  },
  {
    path: 'team-logs',
    loadChildren: './team-logs/team-logs.module#TeamLogsPageModule'
  },
  {
    path: 'events-list',
    canActivate: [AuthGuard],
    loadChildren: './events-list/events-list.module#EventsListPageModule'
  },
  {
    path: 'event-form/:id',
    canActivate: [AuthGuard],
    loadChildren: './event-form/event-form.module#EventFormPageModule'
  },
  {
    path: 'forget-password',
    loadChildren: './forget-password/forget-password.module#ForgetPasswordPageModule'
  },
  {
    path: 'reset-password',
    loadChildren: './set-new-password/set-new-password.module#SetNewPasswordPageModule'
  },
  {
    path: 'teams-list',
    loadChildren: './teams-list/teams-list.module#TeamsListPageModule'
  },
  {
    path: 'members-statistics',
    canActivate: [AuthGuard],
    loadChildren: './members-statistics/members-statistics.module#MembersStatisticsPageModule'
  },
  {
    path: 'user-settings',
    loadChildren: './user-settings/user-settings.module#UserSettingsPageModule'
  },
  {
    path: 'donate',
    loadChildren: './donate/donate.module#DonatePageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
