import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TemplateIdParam {
  @ApiProperty({
    type: String,
    example: '650d64cc538a7b05f70b2378',
    required: true,
  })
  @IsNotEmpty({
    message: 'TemplateId must be present',
  })
  @IsString({
    message: 'TemplateId must be a String',
  })
  templateId: string;
}
