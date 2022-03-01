import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IInviteAttendeeEmail } from '@shared/interfaces/inviteAttendeeEmail.interface';

export class InviteAttendeeEmailRequest implements IInviteAttendeeEmail {
  @IsNotEmpty({
    message: 'Email must be present',
  })
  @IsString({
    message: 'Invalid email value',
  })
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty({
    message: 'MeetingId must be present',
  })
  @IsString({
    message: 'Invalid meetingId value',
  })
  @ApiProperty()
  readonly meetingId: string;
}
