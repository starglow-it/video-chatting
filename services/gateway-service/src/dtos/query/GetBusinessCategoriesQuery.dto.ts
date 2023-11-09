import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { BusinessCategoryTypeEnum } from 'shared-types';
import { toNumber } from 'src/utils/parsers/toNumber';

export class GetBusinessCategoriesQueryDto {
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
    enum: Object.values(BusinessCategoryTypeEnum),
  })
  @IsOptional()
  type: BusinessCategoryTypeEnum;
}
