import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { IBusinessCategory } from 'shared-types';

export class UpdateBusinessCategoryRequest {
  @ApiProperty({
    type: String,
    description: 'Key is lower case charators',
  })
  @IsOptional({
    message: 'Key must be present',
  })
  @IsString({
    message: 'Invalid Key value',
  })
  @Matches(/^[a-z0-9\W]+$/, {
    message: 'Invalid Key format',
  })
  key: IBusinessCategory['key'];

  @ApiProperty({
    type: String,
  })
  @IsOptional({
    message: 'value must be present',
  })
  @IsString({
    message: 'Invalid value',
  })
  value: IBusinessCategory['value'];

  @ApiProperty({
    type: String,
  })
  @IsOptional({
    message: 'Color must be present',
  })
  @IsString({
    message: 'Invalid color value',
  })
  color: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional({
    message: 'Icon must be present',
  })
  @IsString({
    message: 'Invalid icon value',
  })
  icon: string;
}
