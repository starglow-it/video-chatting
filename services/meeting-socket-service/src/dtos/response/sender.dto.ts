import { Expose, Transform } from 'class-transformer';
import { ICommonMeetingUserDTO } from '../../interfaces/common-user.interface';
import { ISenderDto } from '../../interfaces/sender.interface';

export class SenderDto implements ISenderDto {
  @Expose()
  @Transform((data) => data.obj['_id']?.toString())
  id: string;

  @Expose()
  username: ICommonMeetingUserDTO['username'];

  @Expose()
  profileAvatar: ICommonMeetingUserDTO['profileAvatar'];

  @Expose()
  meetingAvatarId: ICommonMeetingUserDTO['meetingAvatarId'];

  @Expose()
  meetingRole: ICommonMeetingUserDTO['meetingRole'];
}
