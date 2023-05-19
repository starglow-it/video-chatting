import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICreateMeeting } from 'shared-types';

export class CreateMeetingRequest {
  @IsNotEmpty({
    message: 'TemplateId must be present',
  })
  @IsString({
    message: 'Invalid templateId value',
  })
  @ApiProperty()
  readonly templateId?: ICreateMeeting['templateId'];
}
