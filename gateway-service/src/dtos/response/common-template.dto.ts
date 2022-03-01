import { ICommonTemplate } from '@shared/interfaces/common-template.interface';
import { IBusinessCategory } from '@shared/interfaces/business-category.interface';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CommonTemplateRestDTO implements ICommonTemplate {
  @Expose()
  @ApiProperty()
  templateId: number;

  @Expose()
  @ApiProperty()
  url: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  maxParticipants: number;

  @Expose()
  @ApiProperty()
  businessCategories: IBusinessCategory[];

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  previewUrl: string;

  @Expose()
  @ApiProperty()
  type: string;
}
