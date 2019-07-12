import { BehaviorSubject, Observable, of } from 'rxjs';

export class LoginStatusServiceMock {
  isLoggedIn: BehaviorSubject < boolean > = new BehaviorSubject(false);
  /* the event that informs listeners about the updates on the authorization state.*/
  $userLoginState: Observable < any >  = of(true);
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
    this.isLoggedIn.next(true);
  }

  /**
   * @author Nermeen Mattar
   * @description logs out the user
   * (default page for unauthorized users) then emitting the new login status for other components/services
   */
  logout() {
    this.isLoggedIn.next(false);
  }

}
