import { Observable } from 'rxjs/internal/Observable';
import { of, throwError } from 'rxjs';

import { MpEvent } from '../../../core/models/mp-event.model';

export const eventData = {
  myTeamMemberId: 1,
  events: [{
    id: 1,
    type: 1 ,
    eventName: '',
    category: {
      id: 1,
      name: ''
    },
    status: '',
    minCriticalValue: 1 ,
    maxCriticalValue: 1 ,
    numOfParticipations: 1 ,
    // detailedParticipations: any; // add type participation
    myParticipation : {
      action: 'participate'
    },
    comment: '',
    location: '',
    startTime: '',
    endTime: '',
    date: '',
    isPastEvent: false,
    hasMinCriticalValue: false,
    hasMaxCriticalValue: false
  }]
};
export class EventsServiceMock {

  constructor() {}

  getEvents() {
    return of({
      events: eventData.events,
      myTeamMemberId: eventData.myTeamMemberId
    });
  }

  getCategories() {
    return of([
      { name: 'category 1', id: 1}
    ]);
  }

  getEventDetails(eventId) {
    return of ({
        absent: [],
        present: []
      });
  }
  getEvent(eventId: number): Observable < any > {
    return of({});
  }
  createEvent(teamId: number, event: Event ): Observable < any > { // Event [] there are other info!
    return of({});
  }
  updateEvent(eventId: number, teamId: number, event: Event ): Observable < any > {
    return of({});
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

  /**
   * @author Nermeen Mattar
   * @description toggles user participaion in the target event
   */
  toggleEventParticipation(toggleValue, eventId, teamMemberId, toggleSuccessMessage): Observable <any> {
    if (eventId && eventId > -1)  {
      return of({});
    } else {
      return throwError({});
    }
  }

  deleteEvent(): Observable <any> {
    return of({});
  }
}
