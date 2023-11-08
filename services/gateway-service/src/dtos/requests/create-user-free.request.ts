import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserFreeRequest {
  @ApiProperty({
    type: String,
    description: 'This field must be string',
  })
  @IsOptional({
    message: 'templateId must be present',
  })
  @IsString()
  readonly templateId: string;

  @ApiProperty({
    type: String,
    description: 'This field must be string',
  })
  @IsOptional({
    message: 'subdomain must be present',
  })
  @IsString()
  readonly subdomain: string;
}
