import { IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IMeetingAvatar, MeetingAvatarRole } from 'shared-types';
import { Transform } from 'class-transformer';

export class CreateMeetingAvatarRequest {
  @ApiProperty({
    type: Array<string>,
    enum: Object.values(MeetingAvatarRole),
  })
  @IsNotEmpty({
    message: 'Roles must be present',
  })
  @IsArray({
    message: 'Invalid Roles value',
  })
  @Transform(({ value }) => value.split(','))
  readonly roles: IMeetingAvatar['roles'];
}
