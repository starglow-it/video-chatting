import { Expose, Transform, Type } from 'class-transformer';
import { ICommonMeetingDTO } from '../../interfaces/common-meeting.interface';
import { ICommonMeetingUserDTO } from '../../interfaces/common-user.interface';
import { CommonUserDTO } from './common-user.dto';
import { MeetingDocument } from '../../schemas/meeting.schema';
import { serializeInstance } from '../serialization';

export class CommonMeetingDTO implements ICommonMeetingDTO {
  @Expose()
  @Transform((data) => data.obj['_id'])
  id: string;

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
  volume: number;

  @Expose()
  isMute: boolean;

  @Expose()
  isBlockAudiences: boolean;

  @Expose()
  @Type(() => CommonUserDTO)
  @Transform((data) => data?.obj?.owner?.['_id']?.toString())
  owner: ICommonMeetingUserDTO['id'];

  @Expose()
  @Type(() => CommonUserDTO)
  users: ICommonMeetingUserDTO[];
}

export const meetingSerialization = <
  D extends MeetingDocument | MeetingDocument[],
>(
  meeting: D,
) => serializeInstance(meeting, CommonMeetingDTO);
