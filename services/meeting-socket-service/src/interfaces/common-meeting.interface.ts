import { ICommonMeetingUserDTO } from './common-user.interface';

export interface ICommonMeetingDTO {
  id: string;
  sharingUserId: string;
  isMonetizationEnabled: boolean;
  mode: string;
  hostUserId: string;
  ownerProfileId: string;
  endsAt: number;
  startAt: number;
  volume: number;
  owner: ICommonMeetingUserDTO['id'];
  users: ICommonMeetingUserDTO[];
}
