import { MpTeamInfo } from './mp-team-info.model';
export interface MpServerSideTeamRoles {
  teamAdmins?: MpTeamInfo[];
  teamMembers?: MpTeamInfo[];
}
