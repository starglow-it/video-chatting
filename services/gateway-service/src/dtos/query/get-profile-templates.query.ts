import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { TemplateCategoryType } from 'shared-types';
import { toNumber } from '../../utils/parsers/toNumber';

export class GetProfileTemplatesQueryDto {
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => toNumber(value, 0))
  skip: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => toNumber(value, 0))
  limit: number;

  @ApiProperty({
    type: String,
    required: false,
    description: `${<TemplateCategoryType>'default'} | ${<TemplateCategoryType>(
      'interior-design'
    )}`,
    example: <TemplateCategoryType>'interior-design',
  })
  @IsOptional()
  categoryType: TemplateCategoryType;
}
