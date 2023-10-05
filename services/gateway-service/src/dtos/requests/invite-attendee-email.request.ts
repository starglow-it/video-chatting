import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IInviteAttendeeEmail, MeetingRole } from 'shared-types';

export class InviteAttendeeEmailRequest implements IInviteAttendeeEmail {
  @ApiProperty({
    type: String
  })
  @IsString({ message: '', each: true })
  readonly userEmails: string[];

  @IsNotEmpty({
    message: 'MeetingId must be present',
  })
  @IsString({
    message: 'Invalid meetingId value',
  })
  @ApiProperty({
    type: String
  })
  readonly meetingId: string;

  @IsNotEmpty({
    message: 'Role must be present',
  })
  @IsString({
    message: 'Invalid role value',
  })
  @ApiProperty({
    type: String,
    example: 'participant'
  })
  readonly role: MeetingRole.Participant | MeetingRole.Lurker;
}
