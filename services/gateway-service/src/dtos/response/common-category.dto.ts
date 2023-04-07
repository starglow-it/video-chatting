import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IBusinessCategory } from 'shared-types';

export class CategoryRestDTO implements IBusinessCategory {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  key: IBusinessCategory['key'];

  @Expose()
  @ApiProperty()
  value: IBusinessCategory['value'];

  @Expose()
  @ApiProperty()
  color: IBusinessCategory['color'];
}
