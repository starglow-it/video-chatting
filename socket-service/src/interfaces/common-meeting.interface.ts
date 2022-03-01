import { ICommonMeetingUserDTO } from './common-user.interface';

export interface ICommonMeetingDTO {
  id: string;
  sharingUserId: number;
  isMonetizationEnabled: boolean;
  mode: string;
  ownerProfileId: string;
  owner: ICommonMeetingUserDTO['id'];
  instanceId: string;
  users: ICommonMeetingUserDTO[];
}
