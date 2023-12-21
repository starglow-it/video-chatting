import { ApiProperty } from '@nestjs/swagger';
import { UpdateTemplateRequest } from './update-template.request';
import { IsBoolean, IsOptional } from 'class-validator';
import { IUpdateUserTemplate } from 'shared-types';

export class UpdateUserTemplateRequest
  extends UpdateTemplateRequest
  implements IUpdateUserTemplate
{
  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean({ message: 'isPublishAudience must be boolean' })
  isPublishAudience: IUpdateUserTemplate['isPublishAudience'];
}
