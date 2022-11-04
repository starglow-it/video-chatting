import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IGetMeetingToken } from 'shared-types';

export class GetMeetingTokenRequest implements IGetMeetingToken {
  @IsNotEmpty({
    message: 'TemplateId must be present',
  })
  @IsString({
    message: 'Invalid templateId value',
  })
  @ApiProperty()
  readonly templateId: IGetMeetingToken['templateId'];

  @IsNotEmpty({
    message: 'UserId must be present',
  })
  @IsString({
    message: 'Invalid userId value',
  })
  @ApiProperty()
  readonly userId: IGetMeetingToken['userId'];
}
