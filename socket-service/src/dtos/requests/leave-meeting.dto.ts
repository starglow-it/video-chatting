import { IsNotEmpty, IsString } from 'class-validator';
import { ILeaveMeeting } from '../../interfaces/leave-meeting.interface';

export class LeaveMeetingRequestDTO implements ILeaveMeeting {
  @IsNotEmpty({
    message: 'Instance id property is empty',
  })
  @IsString({
    message: 'meeting.invalid',
  })
  readonly meetingId: string;
}
