import { Injectable } from '@angular/core';

import { MpDateRange } from '../models/mp-date-range.model';
import { LoginStatusService } from './login-status.service';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private _selectedDateRange: MpDateRange;
  constructor(loginStatusService: LoginStatusService) {
    loginStatusService.$userLoginState.subscribe(isUserLoggedIn => {
      if (!isUserLoggedIn) {
        this.resetData();
      }
    });
    const dateRange = JSON.parse(localStorage.getItem('selectedDateRange'));
    if (dateRange) {
      this.selectedDateRange = {dateFrom: new Date(dateRange.dateFrom), dateTo: new Date(dateRange.dateTo) };
    }
  }


  /**
   * @author Nermeen Mattar
   * @description returns the date range the user has selected.
   */
  get selectedDateRange(): MpDateRange {
    if (!this._selectedDateRange) {
      const todayDate =  new Date();
      this.selectedDateRange =  { dateFrom: new Date('01/01/' + todayDate.getFullYear()), dateTo: todayDate};
    }
    return this._selectedDateRange;
  }

  /**
   * @author Nermeen Mattar
   * @description sets the selected the date range in a private variable and in the localstorage.
   */
  set selectedDateRange(selectedDateRange: MpDateRange) {
    this._selectedDateRange = selectedDateRange;
    if (selectedDateRange) {
      localStorage.setItem('selectedDateRange', JSON.stringify(selectedDateRange));
    } else {
      localStorage.removeItem('selectedDateRange');
    }
  }

  /**
   * @author Nermeen Mattar
   * @description resets the class variables.
   */
  resetData() {
    this.selectedDateRange = null;
  }
}
