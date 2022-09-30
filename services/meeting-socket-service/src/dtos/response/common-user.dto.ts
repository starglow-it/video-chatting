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

  @Expose()
  cameraStatus: string;

  @Expose()
  micStatus: string;

  @Expose()
  isGenerated: boolean;

  @Expose()
  isAuraActive: boolean;

  @Type(() => CommonMeetingDTO)
  @Transform((data) => data.obj?.meeting?.['_id']?.toString())
  meeting: ICommonMeetingDTO['id'];

  @Expose()
  profileAvatar: ICommonMeetingUserDTO['profileAvatar'];

  @Expose()
  @Transform((data) => {
    return {
      bottom: data.obj?.userPosition?.bottom,
      left: data.obj?.userPosition?.left,
    };
  })
  userPosition: ICommonMeetingUserDTO['userPosition'];
}
