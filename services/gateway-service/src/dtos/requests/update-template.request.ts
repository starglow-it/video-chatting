import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IUpdateTemplate, IBusinessCategory, IMediaLink } from 'shared-types';
import { ApiProperty } from '@nestjs/swagger';

class SocialsDTO {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  youtube?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  facebook?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  instagram?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  linkedin?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  twitter?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  custom: string;
}

class BusinessCategoryDTO {
  @ApiProperty({
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Id must be string ' })
  id?: string;

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
    message: 'src must be a string'
  })
  src: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString({
    message: 'thumb must be a string'
  })
  thumb: string;

  @ApiProperty({
    type: String,
    default: true,
  })
  @IsNotEmpty()
  @IsString({
    message: 'platform must be a string'
  })
  platform: string;
}

export class UpdateTemplateRequest implements IUpdateTemplate {
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
      platform: 'youtube'
    }
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
