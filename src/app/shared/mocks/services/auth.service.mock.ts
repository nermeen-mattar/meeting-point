import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
export class AuthServiceMock {
  isLoggedIn: BehaviorSubject < boolean > = new BehaviorSubject(false);
  $userLoggedIn: Observable < boolean > = this.isLoggedIn.asObservable();
  constructor(
  ) {
  }

  login(userCredentials) {
  }

  logout() {
  }

  isAuthenticated(): boolean {
    return true;
  }

  getLoginResponseFromStorage() {
    return JSON.parse(localStorage.getItem('login-response'));
  }

  private addTokenToHttpHeader() {
  }

  clearLoggedInUserInfo() {}
}
