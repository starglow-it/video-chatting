import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { IEnterMeeting } from '../../interfaces/enter-meeting.interface';
import { ICommonMeetingUserDTO } from '../../interfaces/common-user.interface';
import { Type } from 'class-transformer';
import { MeetingUserDto } from './common/meeting-user.dto';

export class EnterMeetingRequestDTO implements IEnterMeeting {
  @IsNotEmpty({
    message: 'Instance id property is empty',
  })
  @IsString({
    message: 'meeting.invalid',
  })
  readonly meetingId: string;

  @IsOptional()
  @ValidateNested({
    message: 'Invalid user',
  })
  @Type(() => MeetingUserDto)
  readonly user: ICommonMeetingUserDTO;
}
