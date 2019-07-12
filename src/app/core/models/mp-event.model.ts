export interface MpEvent {
  id?: number; // no id when creating a new event
  type: number;
  eventName: string;
  timezone: string;
  recurring?: string;
  recurringEvent?: {
    type: string;
    endDate: string;
  };
  endDate?: string;
  category: {
    id?: number,
    name?: string
  };
  status?: string; // needed in events list requests, but not in event form requests
  minCriticalValue: number;
  maxCriticalValue: number;
  numOfParticipations?: number;
  detailedParticipations?: any; // add type participation
  myParticipation?: any;
  comment?: string; // not mandatory
  location?: string; // needed in events form requests, but not in event list requests
  startTime: string;
  endTime: string;
  date: string;
  isPastEvent?: boolean;
  hasMinCriticalValue?: boolean;
  hasMaxCriticalValue?: boolean;
}
