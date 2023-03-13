import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICreateMeeting } from 'shared-types';
import { Test } from './test.validation';

export class CreateMeetingRequest {
  // @IsNotEmpty({
  //   message: 'TemplateId must be present',
  // })
  // @IsString({
  //   message: 'Invalid templateId value',
  // })
  @ApiProperty()
  @Test()
  readonly templateId?: unknown;
}
