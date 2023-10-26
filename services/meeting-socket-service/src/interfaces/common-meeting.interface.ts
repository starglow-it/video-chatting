import { ICommonMeetingUserDTO } from './common-user.interface';

export interface ICommonMeetingDTO {
  id: string;
  sharingUserId: string;
  mode: string;
  hostUserId: string;
  ownerProfileId: string;
  endsAt: number;
  startAt: number;
  volume: number;
  isMute: boolean;
  owner: ICommonMeetingUserDTO['id'];
  users: ICommonMeetingUserDTO[];
}
