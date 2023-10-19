import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PaymentInfo {
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString({
    message: 'Invalid currency',
  })
  currency: string;

  @IsNotEmpty()
  @IsBoolean({
    message: 'Invalid enabled',
  })
  enabled: boolean;
}

export class UpdatePaymentRequestDto {
  @IsOptional()
  @ValidateNested({
    message: 'Invalid meeting payment',
  })
  @Type(() => PaymentInfo)
  meeting: PaymentInfo;

  @IsOptional()
  @ValidateNested({
    message: 'Invalid paywall payment',
  })
  @Type(() => PaymentInfo)
  paywall: PaymentInfo;
}
