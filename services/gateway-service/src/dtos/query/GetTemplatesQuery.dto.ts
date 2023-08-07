import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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
  public skip;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @Transform(({ value }) => toNumber(value, 0))
  @IsOptional()
  @IsNumber()
  public limit;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  public userId;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  public draft;

  @ApiProperty({
    type: Boolean,
    required: false,
  })
  @Transform(({ value }) => toBoolean(value))
  @IsOptional()
  @IsBoolean()
  public isPublic;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  public type;

  @ApiProperty({
    type: [String],
    required: false,
  })
  @IsOptional()
  @Transform(({value}: TransformFnParams) => value.split(','))
  @IsArray()
  public businessCategories: string[];

  @ApiProperty({
    type: String,
    enum: RoomType
  })
  @IsOptional()
  @IsNotEmpty()
  roomType: RoomType;

  @ApiProperty({
    type: Boolean,
    required: false,
    default: false
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
  public sort;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @Transform(({ value }) => toNumber(value, 1))
  @IsOptional()
  @IsNumber()
  public direction;
}
