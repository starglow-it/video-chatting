import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { IStartMeeting } from '../../interfaces/start-meeting.interface';
import { ICommonMeetingUserDTO } from '../../interfaces/common-user.interface';
import { Type } from 'class-transformer';
import { MeetingUserDto } from './common/meeting-user.dto';

export class StartMeetingRequestDTO implements IStartMeeting {
  @IsNotEmpty({
    message: 'Instance id property is empty',
  })
  @IsString({
    message: 'meeting.invalid',
  })
  readonly meetingId: string;

  @IsNotEmpty()
  @ValidateNested({
    message: 'Invalid user',
  })
  @Type(() => MeetingUserDto)
  readonly user: ICommonMeetingUserDTO;
}
