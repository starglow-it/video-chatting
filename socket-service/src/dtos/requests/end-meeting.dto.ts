import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IEndMeeting } from '../../interfaces/end-meeting.interface';

export class EndMeetingRequestDTO implements IEndMeeting {
  @IsNotEmpty({
    message: 'Instance id property is empty',
  })
  @IsString({
    message: 'meeting.invalid',
  })
  readonly meetingId: string;

  @IsOptional()
  @IsString({
    message: 'reason.invalid',
  })
  readonly reason: string;
}
