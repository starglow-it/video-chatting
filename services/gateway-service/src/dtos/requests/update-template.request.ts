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
} from 'class-validator';
import { Type } from 'class-transformer';
import { IUpdateTemplate, IBusinessCategory } from 'shared';

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

class BusinessCategoryDTO {
  @IsOptional()
  @IsString({ message: 'Id must be string ' })
  id?: string;

  @IsString({ message: 'Key must be string ' })
  key: string;

  @IsString({ message: 'Value must be string ' })
  value: string;

  @IsString({ message: 'Color must be string ' })
  color: string;
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
  @IsString({ message: 'Custom link must be string' })
  customLink: string;

  @IsOptional()
  @IsBoolean({ message: 'isMonetizationEnabled must be boolean' })
  isMonetizationEnabled: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'templatePrice must be number' })
  templatePrice: number;

  @IsOptional()
  @IsString({ message: 'Currency must be string' })
  templateCurrency: string;

  @IsOptional()
  @IsObject({ message: 'Business category must be object', each: true })
  @Type(() => BusinessCategoryDTO)
  @ValidateNested()
  businessCategories: IBusinessCategory[];

  @IsOptional()
  @IsString({ message: 'Language must be string', each: true })
  languages: string[];

  @IsOptional()
  @IsObject()
  @Type(() => SocialsDTO)
  @ValidateNested()
  socials: SocialsDTO;
}
