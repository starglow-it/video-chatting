import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { toNumber } from '../../utils/parsers/toNumber';
import { Transform, TransformFnParams } from 'class-transformer';
import { toBoolean } from '../../utils/parsers/toBoolean';
import { ApiProperty } from '@nestjs/swagger';
import { RoomType } from 'shared-types';

export class GetTemplatesQueryDto {
  @ApiProperty({
    type: Number,
    required: false,
  })
  @Transform(({ value }) => toNumber(value, 0))
  @IsOptional()
  @IsNumber()
  public skip: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @Transform(({ value }) => toNumber(value, 0))
  @IsOptional()
  @IsNumber()
  public limit: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  public userId: string;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  public draft: boolean;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  public isPublic: boolean;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  public type: string;

  @ApiProperty({
    type: [String],
    required: false,
  })
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value.split(','))
  @IsArray()
  public businessCategories: string[];

  @ApiProperty({
    type: String,
    enum: RoomType,
  })
  @IsOptional()
  @IsNotEmpty()
  roomType: RoomType;

  @ApiProperty({
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  public isHaveSubdomain: boolean;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  public sort: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @Transform(({ value }) => toNumber(value, 1))
  @IsOptional()
  @IsNumber()
  public direction: number;
}
