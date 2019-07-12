import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { MpEvent } from '../models/mp-event.model';
import { UserService } from './user.service';
import { HttpRequestsService } from './http-requests.service';
import { map } from 'rxjs/operators';
import { differenceInMinutes } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private httpRequestService: HttpRequestsService, private userService: UserService) {}
  currentEvent: Event;

  /**
   * @author Nermeen Mattar
   * @description sends a get request to the server to get the list of events for a specific user and team
   * @param {number} teamId
   * @param {boolean} isPast
   * @param {number} categoryId
   * @returns {Observable < any >}
   */
  getEvents(teamId: number, isPast: boolean, categoryId?: number): Observable < any > { // MpEvent [] there are other info!
    const endPoint = isPast ? 'pastsbyteamid' : 'byteamid';
    const category = categoryId !== -1 ? '?categoryId=' + categoryId : '';
    return this.httpRequestService.httpGet(
      `events/${endPoint}/${teamId}${category}`, {
        failDefault: 'EVENT.EVENTS_GETTING_FAIL'
      }
    ).pipe(
      map(data => {
        if (isPast) {
          return data;
        }
        const numOfEvents = data.events.length;
        for (let eventIndex = 0; eventIndex < numOfEvents; eventIndex++) {
          const currentEvent: MpEvent =  data.events[eventIndex];
          /* can change the following to be differenceInSecond if we want to be more accurate. */
          currentEvent.isPastEvent =  this.isPast(new Date(currentEvent.date + ' ' + currentEvent.startTime));
          this.addHasMinAndHasMaxCriticalValues(currentEvent);
        }
        return data;
      }));
  }

  addHasMinAndHasMaxCriticalValues(event: MpEvent) {
    event.hasMinCriticalValue = Boolean(event.minCriticalValue || event.minCriticalValue === 0);
    event.hasMaxCriticalValue = Boolean(event.maxCriticalValue || event.maxCriticalValue === 0);
  }
  /**
   * @author Nermeen Mattar
   * @description checks if the passed date is in the past by comparing it to current date and time
   * @param {Date} targetDate
   * @returns {boolean}
   */

  isPast(targetDate: Date): boolean {
    return differenceInMinutes(new Date(targetDate), new Date()) < 0;
  }

  /**
   * @author Nermeen Mattar
   * @description sends a get request to the server to receive the details for the chosen event
   * @param {number} eventId
   * @returns {Observable <any>}
   */
  getEventDetails(eventId: number): Observable < any > {
    return this.httpRequestService.httpGet(
      `eventstate/${eventId}`, {
        failDefault: 'EVENT.EVENT_GETTING_FAIL'
      }).pipe(map((event) => {
        this.addHasMinAndHasMaxCriticalValues(event);
        return event;
      }));

  }

  /**
   * @author Nermeen Mattar
   * @description sends a request to the server to change the user's participation status for a specific event
   * @param {boolean} isParticipated
   * @param {number} eventId
   * @param {number} teamMemberId
   * @returns {Observable < any >}
   */
  toggleEventParticipation(
    isParticipated: boolean,
    eventId: number,
    teamMemberId: number,
    toggleSuccessMessage: string,
    cancelReason?: string
  ): Observable < any > {
    const participationText = isParticipated ? 'participate' : 'cancel';
    return this.httpRequestService.httpPut(
      'particips',
      isParticipated ?
      {
        eventId: eventId,
        participationText: participationText,
        teamMemberId: teamMemberId
      } : {
        eventId: eventId,
        participationText: participationText,
        teamMemberId: teamMemberId,
        cancellationReason: cancelReason
      }, {
        success: toggleSuccessMessage,
        failDefault: 'EVENT.EVENT_CHANGING_PARTICIPATION_FAIL'
      });
  }

  /**
   * @author Nermeen Mattar
   * @description sends a request to the server to delete a specific event
   * @param {number} eventId
   * @returns {Observable <any>}
   */
  deleteEvent(eventId: number): Observable < any > {
    return this.httpRequestService.httpDelete(
      `events/${eventId}`, {
        success: 'EVENT.EVENT_DELETING_SUCCESS',
        failDefault: 'EVENT.EVENT_DELETING_FAIL'
      });
  }

  /**
   * @author Nermeen Mattar
   * @description sends a request to the server to delete the series of recurring events
   * @param {number} eventId
   * @returns {Observable <any>}
   */
  deleteRecurringEvent(eventId: number): Observable < any > {
    return this.httpRequestService.httpDelete(
      `events/recurring/${eventId}`, {
        success: 'EVENT.RECURRING_EVENT_DELETING_SUCCESS',
        failDefault: 'EVENT.RECURRING_EVENT_DELETING_FAIL'
      });
  }

  /** Following are functions needed for event form **/

  /**
   * @author Nermeen Mattar
   * @description sends a get request to the server to receive the event for the received team
   * @param {number} eventId
   * @returns {Observable <any>}
   */
  getEvent(eventId: number): Observable < any > {
    return this.httpRequestService.httpGet(
      `events/${eventId}`, {
        failDefault: 'EVENT.EVENT_GETTING_FAIL'
      });
  }

  /**
   * @author Nermeen Mattar
   * @description sends a post request to the server to create a new event
   * @param {teamId} number
   * @param {MpEvent } event
   * @returns {Observable <any>}
   */
  createEvent(teamId: number, event: MpEvent ): Observable < any > { // Event [] there are other info!
    return this.httpRequestService.httpPost(
      'events', {teamId: teamId, ...event}, {
        success: 'EVENT.EVENT_CREATING_SUCCESS',
        failDefault: 'EVENT.EVENT_CREATING_FAIL'
      });
  }

  /**
   * @author Nermeen Mattar
   *  @description sends a get request to the server to update the event with the received id
   * @param {number} eventId
   * @param {number} teamId
   * @param {MpEvent } event
   * @returns {Observable <any>}
   */
  updateEvent(eventId: number, teamId: number, event: MpEvent ): Observable < any > {
    const urlPath = event.recurring ? 'recurring/' : '';
    return this.httpRequestService.httpPut(
      `events/${urlPath}${eventId}`, event, {
        success: 'EVENT.EVENT_UPDATING_SUCCESS',
        failDefault: 'EVENT.EVENT_UPDATING_FAIL'
      });
  }

  /**
   * @author Nermeen Mattar
   * @description calculates the number of participations for each event and add it to the event object
   * @param {Event []} events
   */
  addNumOfParticipationsToEvents(events: MpEvent[]) {
    let numOfParitications;
    const eventsListLen = events.length;
    for (let eventIndex = 0; eventIndex < eventsListLen; eventIndex++) {
      numOfParitications = 0;
      const eventParticipations = events[eventIndex].detailedParticipations;
      if (eventParticipations) {
        const eventParticipationsLen = eventParticipations.length;
        for (let participationIndex = 0; participationIndex < eventParticipationsLen; participationIndex++) {
          if (eventParticipations[participationIndex].action === 'participate') {
            numOfParitications++;
          }
        }
      }
      events[eventIndex].numOfParticipations = numOfParitications;
    }
  }
}
