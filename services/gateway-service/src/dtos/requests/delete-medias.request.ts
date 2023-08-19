import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DeleteMediasRequest {
  @ApiProperty({
    type: [String],
    description: 'This is a list media Ids',
  })
  @IsArray()
  ids: string[];
}
