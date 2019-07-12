import * as moment from 'moment-timezone';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MpDateAdapter {

  /**
  * @author Syed Saad Qamar @copied from web
  * @description To get formatted date from UTC date-time string.
  */
  getFormattedFormDate(utcTimeString: string, timezone: string = null) {
    return moment(utcTimeString).local().format('YYYY-MM-DD');
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }

  /**
  * @author Syed Saad Qamar @copied from web
  * @description To get formatted time from UTC date-time string.
  */
  getFormattedTime(utcTimeString: string, timezone: string = null) {
    if (timezone) {
      return moment(utcTimeString).tz(timezone).format('HH:mm');
    }
    return moment(utcTimeString).local().format('HH:mm');
  }

  /**
  * @author Syed Saad Qamar @copied from web
  * @description To get formatted date from UTC date-time string.
  */
  getFormattedDate(utcTimeString: string, timezone: string = null) {
    if (timezone) {
      return moment(utcTimeString).tz(timezone).format('DD.MM.YYYY');
    }
    return moment(utcTimeString).local().format('DD.MM.YYYY');
  }
}
