import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { TemplateCateogyType } from 'shared-types';

export class CreateCommonTemplateRequestDto {
  @ApiProperty({
    type: String,
    required: false,
    default: <TemplateCateogyType>'default',
    description: `${<TemplateCateogyType>'default'} or ${<TemplateCateogyType>(
      'interior-design'
    )}`,
  })
  @IsOptional()
  @IsString({
    message: 'Invalid category type',
  })
  categoryType: TemplateCateogyType;
}
