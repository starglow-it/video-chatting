import { IsNotEmpty, IsString } from 'class-validator';

import { IEnterMeeting } from '../../interfaces/enter-meeting.interface';
import { ICommonMeetingUserDTO } from '../../interfaces/common-user.interface';

export class EnterMeetingRequestDTO implements IEnterMeeting {
  @IsNotEmpty({
    message: 'Instance id property is empty',
  })
  @IsString({
    message: 'meeting.invalid',
  })
  readonly meetingId: string;

  readonly user: ICommonMeetingUserDTO;
}
