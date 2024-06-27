import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AddWaitingUserToUserTemplateRequest
{
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'roomId must be string' })
  roomId: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'localUserId must be string' })
  localUserId: string;
}
