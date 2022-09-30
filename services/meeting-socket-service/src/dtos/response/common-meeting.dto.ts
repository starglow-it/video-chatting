import { Expose, Transform, Type } from 'class-transformer';
import { ICommonMeetingDTO } from '../../interfaces/common-meeting.interface';
import { ICommonMeetingUserDTO } from '../../interfaces/common-user.interface';
import { CommonUserDTO } from './common-user.dto';

export class CommonMeetingDTO implements ICommonMeetingDTO {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

  @Expose()
  isMonetizationEnabled: boolean;

  @Expose()
  mode: string;

  @Expose()
  ownerProfileId: string;

  @Expose()
  sharingUserId: string;

  @Expose()
  hostUserId: string;

  @Expose()
  endsAt: number;

  @Expose()
  startAt: number;

  @Expose()
  @Type(() => CommonUserDTO)
  @Transform((data) => data?.obj?.owner?.['_id']?.toString())
  owner: ICommonMeetingUserDTO['id'];

  @Type(() => CommonUserDTO)
  users: ICommonMeetingUserDTO[];
}
