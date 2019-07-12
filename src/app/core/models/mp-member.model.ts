import { MpNestedMember } from './mp-nested-member';

export interface MpMember {
  id?: number; // no id when creating a new event
  firstName: string;
  acceptInvitation?: boolean;
  entryDate?: any;
  lastName?: string;
  isAdmin?: boolean;
  email?: string;
  mail?: string;
  mobile?: number;
  allowReminders?: boolean;
  active?: boolean;
  name?: string;
  new?: boolean;
  participations?: number;
  cancelations?: number;
  member?: MpNestedMember;
  team?: {
    directlink?: string;
    id: number;
    name?: string;
    sendReminder?: boolean;
    trainer?: any;
    cancelWithReason?: boolean
  };
  teamAdminId?: number;
}
