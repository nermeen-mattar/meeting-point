import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  displaySpinner = false;
  displayMessage: string;
  enteredEmail: string;
  loginForm: FormGroup = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userPassword: new FormControl('', [Validators.required]),
  });
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  /**
   * @author Nermeen Mattar
   * @description sends the user name and the password to the login endpoint and hides the spinner once reposonse is recevied
   * @param {ClientSideLoginInfo} loginFormValue
   */
  login(loginForm: FormGroup) {
    if (!loginForm.valid) {
      return;
    }
    this.displaySpinner = true;
    this.displayMessage = null;
    const loginFormValue = loginForm.value;
    this.enteredEmail = loginFormValue.userEmail;
    this.authService.login({
      username: loginFormValue.userEmail,
      password: loginFormValue.userPassword
    }).subscribe(res => {
      if (res.statusCode) { // temp until the backend fixes the case of email not confirmed by returning an error
        this.displaySpinner = false;
      }
    }, () => {
      this.displaySpinner = false;
    });
  }

}
