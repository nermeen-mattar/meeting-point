import { MpServerSideTeamRoles } from './mp-server-side-team-roles.model';
import { MpMember } from './mp-member.model';
export interface LoginResponse {
  token: string;
  member: MpMember;
  isAuthorized: string;
  hasRoles: string[];
  teamRoles: MpServerSideTeamRoles;
}
