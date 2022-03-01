import { IsNotEmpty, IsString } from 'class-validator';
import { IEndMeeting } from '../../interfaces/end-meeting.interface';

export class EndMeetingRequestDTO implements IEndMeeting {
  @IsNotEmpty({
    message: 'Instance id property is empty',
  })
  @IsString({
    message: 'meeting.invalid',
  })
  readonly meetingId: string;
}
