import { Expose, Transform, Type } from 'class-transformer';
import { ICommonMeetingUserDTO } from '../../interfaces/common-user.interface';
import { CommonMeetingDTO } from './common-meeting.dto';

export class CommonUserDTO implements ICommonMeetingUserDTO {
  @Expose()
  @Transform((data) => data.obj['_id']?.toString())
  id: string;

  @Expose()
  profileId: ICommonMeetingUserDTO['profileId'];

  @Expose()
  socketId: ICommonMeetingUserDTO['socketId'];

  @Expose()
  username: ICommonMeetingUserDTO['username'];

  @Expose()
  joinedAt: ICommonMeetingUserDTO['joinedAt'];

  @Expose()
  accessStatus: ICommonMeetingUserDTO['accessStatus'];

  @Expose()
  cameraStatus: ICommonMeetingUserDTO['cameraStatus'];

  @Expose()
  micStatus: ICommonMeetingUserDTO['micStatus'];

  @Expose()
  isGenerated: ICommonMeetingUserDTO['isGenerated'];

  @Expose()
  isAuraActive: ICommonMeetingUserDTO['isAuraActive'];

  @Type(() => CommonMeetingDTO)
  @Transform((data) => data.obj?.meeting?.['_id']?.toString())
  meeting: ICommonMeetingUserDTO['meeting'];

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

  @Expose()
  userSize: ICommonMeetingUserDTO['userSize'];
}
