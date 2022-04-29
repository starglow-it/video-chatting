import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

import { IEnterMeeting } from '../../interfaces/enter-meeting.interface';
import { ICommonMeetingUserDTO } from '../../interfaces/common-user.interface';

export class MeetingAccessAnswerRequestDTO implements IEnterMeeting {
  @IsNotEmpty({
    message: 'credentials.invalid',
  })
  @IsString({
    message: 'credentials.invalid',
  })
  readonly meetingId: string;

  @IsNotEmpty({
    message: 'credentials.invalid',
  })
  @IsBoolean({
    message: 'credentials.invalid',
  })
  readonly isUserAccepted: string;

  @IsNotEmpty({
    message: 'credentials.invalid',
  })
  @IsString({
    message: 'credentials.invalid',
  })
  readonly userId: ICommonMeetingUserDTO['id'];
}
