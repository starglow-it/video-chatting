import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IUpdateTemplate } from '@shared/interfaces/update-template.interface';

class SocialsDTO {
  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  youtube?: string;

  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  facebook?: string;

  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  instagram?: string;

  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  linkedin?: string;

  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  twitter?: string;

  @IsOptional()
  @IsString({ message: 'Url must be string ' })
  @IsUrl({}, { message: 'Url must be valid ' })
  custom: string;
}

export class UpdateTemplateRequest implements IUpdateTemplate {
  @IsString({ message: 'Company Name must be string' })
  companyName: string;

  @IsOptional()
  @ValidateIf((object, value) => Boolean(value))
  @IsString({ message: 'Contact Email must be string' })
  @IsEmail({}, { message: 'Invalid Email' })
  contactEmail: string;

  @IsString({ message: 'FullName must be string' })
  fullName: string;

  @IsString({ message: 'Position must be string' })
  position: string;

  @IsString({ message: 'Description must be string' })
  description: string;

  @IsString({ message: 'Business category must be string', each: true })
  businessCategories: string[];

  @IsString({ message: 'Language must be string', each: true })
  languages: string[];

  @IsObject()
  @Type(() => SocialsDTO)
  @ValidateNested()
  socials: SocialsDTO;
}
