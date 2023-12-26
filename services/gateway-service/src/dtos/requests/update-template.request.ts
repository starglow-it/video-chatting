import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested,
  IsNotEmpty,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  IUpdateTemplate,
  IBusinessCategory,
  IMediaLink,
  TemplateLink,
} from 'shared-types';
import { ApiProperty } from '@nestjs/swagger';

class SocialsDTO {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  youtube: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  facebook: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  instagram: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  linkedin: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  twitter: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  custom: string;
}

class LinkPosition {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  top: number;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  left: number;
}

class TemplateLinkDto implements TemplateLink {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString({ message: 'item must be string' })
  item: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'title must be string' })
  title: string;

  @ApiProperty({
    type: LinkPosition,
  })
  @IsNotEmpty()
  @Type(() => LinkPosition)
  position: { top: number; left: number };
}

class BusinessCategoryDTO {
  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Id must be string ' })
  id: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Key must be string ' })
  key: string;

  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Value must be string ' })
  value: string;
}

class MediaLinkReqDto implements IMediaLink {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString({
    message: 'src must be a string',
  })
  src: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString({
    message: 'thumb must be a string',
  })
  thumb: string;

  @ApiProperty({
    type: String,
    default: true,
  })
  @IsNotEmpty()
  @IsString({
    message: 'platform must be a string',
  })
  platform: string;
}

class UserPositionDto {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  bottom: number;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  left: number;
}
export class UpdateTemplateRequest implements IUpdateTemplate {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'DraftUrl must be string' })
  draftUrl: string;

  @ApiProperty({
    required: false,
    type: [UserPositionDto],
  })
  @IsOptional()
  @IsObject({ message: 'usersPosition is must be object', each: true })
  @Type(() => UserPositionDto)
  @ValidateNested()
  usersPosition: IUpdateTemplate['usersPosition'];

  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsNumber({}, { message: 'usersSize must be a number', each: true })
  usersSize: number[];

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsString({ message: 'indexUsers must be string', each: true })
  indexUsers: string[];


  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Name must be string' })
  name: string;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(2)
  maxParticipants: number;

  @ApiProperty({
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean({ message: 'isPublic must be boolean' })
  isPublic: boolean;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Subdomain must be string' })
  @IsUrl({}, { message: 'Subdomain must be a url' })
  subdomain: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Company Name must be string' })
  companyName: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @ValidateIf((object, value) => Boolean(value))
  @IsString({ message: 'Contact Email must be string' })
  @IsEmail({}, { message: 'Invalid Email' })
  contactEmail: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'FullName must be string' })
  fullName: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Position must be string' })
  position: string;

  @ApiProperty({
    type: MediaLinkReqDto,
    required: false,
    example: {
      src: 'https://123.youtube.com',
      thumb: 'https://blabla.com',
      platform: 'youtube',
    },
  })
  @IsOptional()
  @Type(() => MediaLinkReqDto)
  mediaLink: IMediaLink;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Description must be string' })
  description: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Description must be string' })
  signBoard: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Custom link must be string' })
  customLink: string;

  @ApiProperty({
    required: false,
    type: [BusinessCategoryDTO],
  })
  @IsOptional()
  @IsObject({ message: 'Business category must be object', each: true })
  @Type(() => BusinessCategoryDTO)
  @ValidateNested()
  businessCategories: IBusinessCategory[];

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsString({ message: 'Language must be string', each: true })
  languages: string[];

  @ApiProperty({
    required: false,
    type: SocialsDTO,
  })
  @IsOptional()
  @IsObject()
  @Type(() => SocialsDTO)
  @ValidateNested()
  socials: SocialsDTO;

  @ApiProperty({
    required: false,
    type: [String],
    description: 'Preview Urls are ids',
  })
  @IsOptional()
  @IsString({ message: 'Preview Url must be string', each: true })
  previewUrls: string[];

  @ApiProperty({
    required: false,
    type: Array<TemplateLinkDto>,
    description: 'Links are array of object',
  })
  @IsOptional()
  @Type(() => TemplateLinkDto)
  links: IUpdateTemplate['links'];

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Url must be string', each: true })
  url: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Template type must be string', each: true })
  templateType: string;
}
