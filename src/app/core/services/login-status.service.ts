import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginStatusService {
  private isLoggedIn: BehaviorSubject < boolean > = new BehaviorSubject(false);
  /* the event that informs listeners about the updates on the authorization state.*/
  $userLoginState: Observable < any > = this.isLoggedIn.asObservable();
  constructor(private router: Router) {
    this.updateLoginStateFromTheLocalStorage();
  }

  /**
   * @author Nermeen Mattar
   * @description checks if the user is authenticated returns the login state of the current user whether logged in or not
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.isLoggedIn.getValue();
  }

  /**
   * @author Nermeen Mattar
   * @description Emits an event to inform listenting components about the updated login status based on the value of the login response.
   */
  updateLoginStateFromTheLocalStorage() {
    this.isLoggedIn.next(Boolean(localStorage.getItem('token'))); /* on refresh only send isAthorized without token object */
  }

  /**
   * @author Nermeen Mattar
   * @description upon successful user login/switch this function navigates to the events page
   * (default page for authorized users) then emitting the new login status for other components/services
   * @memberof AuthService
   */
  onLoginRequestSuccess() {
    this.router.navigateByUrl('events-list');
    this.isLoggedIn.next(true);
  }

  /**
   * @author Nermeen Mattar
   * @description logs out the user by navigating to login page
   * (default page for unauthorized users) then emitting the new login status for other components/services
   */
  logout() {
    localStorage.clear();
    this.router.navigateByUrl('login');
    this.isLoggedIn.next(false);
  }

}
