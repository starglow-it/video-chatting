import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IGetMeetingTokenDTO } from 'shared';

export class GetMeetingTokenRequest implements IGetMeetingTokenDTO {
  @IsNotEmpty({
    message: 'TemplateId must be present',
  })
  @IsString({
    message: 'Invalid templateId value',
  })
  @ApiProperty()
  readonly templateId: IGetMeetingTokenDTO['templateId'];

  @IsNotEmpty({
    message: 'UserId must be present',
  })
  @IsString({
    message: 'Invalid userId value',
  })
  @ApiProperty()
  readonly userId: IGetMeetingTokenDTO['userId'];
}
