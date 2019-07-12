
import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'mp-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  @Input() passwordControl: FormControl = new FormControl();
  @Input() fieldLabel = 'USER.PASSWORD';
  displayPassword: boolean;
  constructor() { }

  ngOnInit() {
  }

  toggleDisplayPassword() {
    this.displayPassword = !this.displayPassword;
  }
}
