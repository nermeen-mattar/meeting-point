import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';

import { HttpRequestsService } from './http-requests.service';

@Injectable({
  providedIn: 'root'
})
export class PingService {
  pingDuration = 300000;
  intervalSubscription: Subscription;
  constructor (private httpRequestsService: HttpRequestsService) {
  }

  /**
   * @author Nermeen Mattar
   * @description starts the interval for pinging server
   */
  startPingJob(pingDuration = this.pingDuration) {
    this.stopPingJob();
    this.intervalSubscription = interval(pingDuration).subscribe(() => {
      const lastRequestTimeStamp =  JSON.parse(localStorage.getItem('lastSuccessfulRequestTimeStamp'));
      if (lastRequestTimeStamp) {
        const difference =  Number(new Date()) - Number(new Date(lastRequestTimeStamp));
        if ( difference < this.pingDuration ) {
          return this.startPingJob ( this.pingDuration - difference ); /* if we don't need to be precise we can replace it with return;*/
        }
      }
      this.pingServer();
    });
  }

  /**
   * @author Nermeen Mattar
   * @description stops the interval for pinging server
   */
  stopPingJob() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  /**
   * @author Nermeen Mattar
   * @description send ping request to the server to the newest token
   */
  pingServer() {
    this.httpRequestsService.httpGet('ping', {fail: 'NO_ERROR_MESSAGE'}).subscribe();
  }
}
