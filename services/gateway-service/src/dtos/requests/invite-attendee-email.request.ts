import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IInviteAttendeeEmail } from 'shared-types';

export class InviteAttendeeEmailRequest implements IInviteAttendeeEmail {
  @ApiProperty()
  @IsString({ message: '', each: true })
  readonly userEmails: string[];

  @IsNotEmpty({
    message: 'MeetingId must be present',
  })
  @IsString({
    message: 'Invalid meetingId value',
  })
  @ApiProperty()
  readonly meetingId: string;
}
