import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IBusinessCategory } from '@shared/interfaces/business-category.interface';

export class CategoryRestDTO implements IBusinessCategory {
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
