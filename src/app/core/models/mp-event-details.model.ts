import { MpMember } from './mp-member.model';
import { MpEvent } from './mp-event.model';

export interface MpEventDetails extends MpEvent {
  absent: MpMember[];
  present: MpMember[];
}

