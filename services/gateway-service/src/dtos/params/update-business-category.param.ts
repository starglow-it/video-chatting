import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBusinessCategoryParam {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty({
    message: 'Business Category mus be not empty',
  })
  @IsString({
    message: 'Business Category must be a string',
  })
  id: string;
}
