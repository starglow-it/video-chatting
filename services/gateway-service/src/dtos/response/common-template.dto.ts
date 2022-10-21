import { ICommonTemplate } from 'shared';
import { IBusinessCategory } from 'shared';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IPreviewImage } from 'shared';

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
  shortDescription: string;

  @Expose()
  @ApiProperty()
  previewUrls: IPreviewImage[];

  @Expose()
  @ApiProperty()
  type: string;

  @Expose()
  @ApiProperty()
  isAudioAvailable: boolean;

  @Expose()
  @ApiProperty()
  usersPosition: { bottom: number; left: number }[];

  @Expose()
  @ApiProperty()
  draft: boolean;

  @Expose()
  @ApiProperty()
  isPublic: boolean;

  @Expose()
  @ApiProperty()
  author: string;

  @Expose()
  @ApiProperty()
  templateType: 'video' | 'image';
}
