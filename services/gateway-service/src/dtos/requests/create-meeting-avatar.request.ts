import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IMeetingAvatar } from 'shared-types';
import { Transform } from 'class-transformer';

export class CreateMeetingAvatarRequest {
  @IsNotEmpty({
    message: 'Roles must be present',
  })
  @IsArray({
    message: 'Invalid Roles value',
  })
  @Transform(({ value }) => value.split(','))
  readonly roles: IMeetingAvatar['roles'];
}
