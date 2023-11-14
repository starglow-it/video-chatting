import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { TemplateCategoryType } from 'shared-types';

export class CreateCommonTemplateRequestDto {
  @ApiProperty({
    type: String,
    required: false,
    default: <TemplateCategoryType>'default',
    description: `${<TemplateCategoryType>'default'} or ${<TemplateCategoryType>(
      'interior-design'
    )}`,
  })
  @IsOptional()
  @IsString({
    message: 'Invalid category type',
  })
  categoryType: TemplateCategoryType;
}
