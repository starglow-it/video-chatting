import { ICommonMeetingUserDTO } from './common-user.interface';

export interface ICommonMeetingDTO {
  id: string;
  sharingUserId: number;
  isMonetizationEnabled: boolean;
  mode: string;
  hostUserId: string;
  ownerProfileId: string;
  endsAt: number;
  startAt: number;
  owner: ICommonMeetingUserDTO['id'];
  users: ICommonMeetingUserDTO[];
}
