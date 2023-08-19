import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MediaCategoryParam {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty({
    message: 'Media Category mus be not empty',
  })
  @IsString({
    message: 'Media Category must be a string',
  })
  categoryId: string;
}
