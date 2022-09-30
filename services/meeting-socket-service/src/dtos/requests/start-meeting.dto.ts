import { IsNotEmpty, IsString } from 'class-validator';
import { IStartMeeting } from '../../interfaces/start-meeting.interface';
import { ICommonMeetingUserDTO } from '../../interfaces/common-user.interface';

export class StartMeetingRequestDTO implements IStartMeeting {
  @IsNotEmpty({
    message: 'Instance id property is empty',
  })
  @IsString({
    message: 'meeting.invalid',
  })
  readonly meetingId: string;

  readonly user: ICommonMeetingUserDTO;
}
