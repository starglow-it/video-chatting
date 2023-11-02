import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class DeleteBusinessCategoriesRequest {
  @ApiProperty({
    type: [String],
    description: 'This is a list business category Ids',
  })
  @IsMongoId({
    each: true,
  })
  ids: string[];
}
