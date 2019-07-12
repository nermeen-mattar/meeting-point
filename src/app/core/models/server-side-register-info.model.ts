export interface ServerSideRegisterInfo {
  teamName: string;
  email: string;
  firstName?: string; /* first name and last name are not required for an existing user */
  lastName?: string;
  password: string;
  isTeamMember: boolean;
  confirmTerms: boolean;
  timezone: string;
}
