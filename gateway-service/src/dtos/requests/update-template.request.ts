import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
  ValidateNested,
  IsBoolean,
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
  @IsOptional()
  @IsString({ message: 'Company Name must be string' })
  companyName: string;

  @IsOptional()
  @ValidateIf((object, value) => Boolean(value))
  @IsString({ message: 'Contact Email must be string' })
  @IsEmail({}, { message: 'Invalid Email' })
  contactEmail: string;

  @IsOptional()
  @IsString({ message: 'FullName must be string' })
  fullName: string;

  @IsOptional()
  @IsString({ message: 'Position must be string' })
  position: string;

  @IsOptional()
  @IsString({ message: 'Description must be string' })
  description: string;

  @IsOptional()
  @IsString({ message: 'Description must be string' })
  signBoard: string;

  @IsOptional()
  @IsBoolean({ message: 'isMonetizationEnabled must be boolean' })
  isMonetizationEnabled: boolean;

  @IsOptional()
  @IsString({ message: 'templatePrice must be string' })
  templatePrice: string;

  @IsOptional()
  @IsString({ message: 'Currency must be string' })
  templateCurrency: string;

  @IsOptional()
  @IsString({ message: 'Business category must be string', each: true })
  businessCategories: string[];

  @IsOptional()
  @IsString({ message: 'Language must be string', each: true })
  languages: string[];

  @IsOptional()
  @IsObject()
  @Type(() => SocialsDTO)
  @ValidateNested()
  socials: SocialsDTO;
}
