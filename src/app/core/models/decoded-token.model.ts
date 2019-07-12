import { MpServerSideTeamRoles } from './mp-server-side-team-roles.model';
export interface DecodedToken {
  roles: string[];
  sub: string; /* username/email */
  teamRoles: MpServerSideTeamRoles;
  memberId: number;
  firstName: string;
  lastName: string;
  mobile?: number;
  timezone: string;
}
