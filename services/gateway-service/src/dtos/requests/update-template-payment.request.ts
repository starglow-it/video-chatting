import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { StripeCurrency } from 'shared-const';

class UpdateTemplatePaymentsData {
  @ApiProperty({
    type: String,
    enum: Object.values(StripeCurrency),
    example: StripeCurrency.USD,
    default: StripeCurrency.USD,
  })
  @IsNotEmpty()
  @IsString({ message: 'Currency must be string ' })
  currency: string;

  @ApiProperty({
    type: Number,
    example: 5,
    default: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    type: Boolean,
    example: false,
    default: false,
  })
  @IsNotEmpty()
  @IsBoolean({ message: 'IsEnabled must be boolean ' })
  enabled: boolean;
}

export class UpdateTemplatePaymentsRequest {
  @ApiProperty({
    type: UpdateTemplatePaymentsData,
  })
  @IsOptional()
  @Type(() => UpdateTemplatePaymentsData)
  meeting?: UpdateTemplatePaymentsData;

  @ApiProperty({
    type: UpdateTemplatePaymentsData,
  })
  @IsOptional()
  @Type(() => UpdateTemplatePaymentsData)
  paywall?: UpdateTemplatePaymentsData;
}
