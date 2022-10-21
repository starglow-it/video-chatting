import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ICreateMeetingDTO } from 'shared';

export class CreateMeetingRequest implements ICreateMeetingDTO {
  @IsNotEmpty({
    message: 'TemplateId must be present',
  })
  @IsString({
    message: 'Invalid templateId value',
  })
  @ApiProperty()
  readonly templateId: ICreateMeetingDTO['templateId'];
}
