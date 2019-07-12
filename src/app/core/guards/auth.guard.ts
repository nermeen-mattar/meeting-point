import { LoginStatusService } from '../services/login-status.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs/internal/Observable';

/**
 *
 * @author Nermeen Mattar
 * @export
 * @class AuthGuard
 * @implements {CanActivate}
 * @description If the user is authenticated it prevents visiting auth module and if not authenticated prevents visiting account
 * based pages. It also navigates to the correct module in case the user is manually changing the route and can activate is false.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
    private loginStatusService: LoginStatusService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable < boolean > | Promise < boolean > | boolean {
    if (this.loginStatusService.isAuthenticated()) { // when the user is logged in
      if (this.isAuthPage(state)) {
        if (this.router.routerState.snapshot.url === '') {
          this.router.navigateByUrl('events-list'); // when manually changing the route to a wrong route or to a non account based page.
        }
        return false;
      } else {
        return true;
      }
    } else {  // when the user is not logged in
      if (this.isAuthPage(state)) {
        return true;
      } else {
        if (this.router.routerState.snapshot.url === '') {
          this.router.navigateByUrl('login'); // when manually changing the route to a wrong route or to an account based page.
        }
        return false;
      }
    }
  }

  isAuthPage(state) {
    const authRoutes = [
      'login',
      'register',
      'forgot-password'
    ];
    return authRoutes.find(route => state.url.indexOf(route) > -1);
  }
}
