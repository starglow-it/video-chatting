import { Expose, Transform, Type } from 'class-transformer';
import { ICommonMeetingUserDTO } from '../../interfaces/common-user.interface';
import { CommonMeetingDTO } from './common-meeting.dto';
import { ICommonMeetingDTO } from '../../interfaces/common-meeting.interface';

export class CommonUserDTO implements ICommonMeetingUserDTO {
  @Expose()
  @Transform((data) => data.obj['_id']?.toString())
  id: string;

  @Expose()
  profileId: string;

  @Expose()
  socketId: string;

  @Expose()
  username: string;

  @Expose()
  accessStatus: string;

  cameraStatus: string;
  micStatus: string;

  @Expose()
  isGenerated: boolean;

  @Type(() => CommonMeetingDTO)
  @Transform((data) => data.obj.meeting['_id']?.toString())
  meeting: ICommonMeetingDTO['id'];

  @Expose()
  meetingUserId: ICommonMeetingUserDTO['meetingUserId'];

  @Expose()
  profileAvatar: ICommonMeetingUserDTO['profileAvatar'];
}
