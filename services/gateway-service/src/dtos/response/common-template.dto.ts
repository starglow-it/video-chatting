import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  ICommonTemplate,
  IBusinessCategory,
  IPreviewImage,
  IMediaLink,
} from 'shared-types';

class MediaLinkResDto implements IMediaLink {
  @ApiProperty({
    type: String,
    required: true,
  })
  @Expose()
  src: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  thumb: string;

  @ApiProperty({
    type: String,
    default: true,
  })
  platform: string;
}

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
  @ApiProperty({
    type: MediaLinkResDto,
    required: false,
  })
  mediaLink: IMediaLink;

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
  authorThumbnail: ICommonTemplate['authorThumbnail'];

  @Expose()
  @ApiProperty()
  authorRole: ICommonTemplate['authorRole'];

  @Expose()
  @ApiProperty()
  authorName: ICommonTemplate['authorName'];

  @Expose()
  @ApiProperty()
  templateType: 'video' | 'image';

  @Expose()
  @ApiProperty()
  isTemplatePurchased: boolean;

  @Expose()
  @ApiProperty()
  roomType: ICommonTemplate['roomType'];

  @Expose()
  @ApiProperty()
  subdomain: ICommonTemplate['subdomain'];

  @Expose()
  @ApiProperty()
  categoryType: ICommonTemplate['categoryType'];
}
