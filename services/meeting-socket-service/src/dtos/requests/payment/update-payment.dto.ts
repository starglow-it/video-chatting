import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { MeetingRole } from 'shared-types';

class PaymentInfo {
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

class QueryPaymentRequest
  implements Record<Exclude<MeetingRole, 'host'>, PaymentInfo>
{
  @IsNotEmpty()
  @ValidateNested({
    message: 'Invalid participant payment info',
  })
  @Type(() => PaymentInfo)
  participant: PaymentInfo;

  @IsNotEmpty()
  @ValidateNested({
    message: 'Invalid lurker payment info',
  })
  @Type(() => PaymentInfo)
  lurker: PaymentInfo;
}

export class UpdatePaymentRequestDto {
  @IsOptional()
  @ValidateNested({
    message: 'Invalid meeting payment info',
  })
  @Type(() => QueryPaymentRequest)
  meeting: QueryPaymentRequest;

  @IsOptional()
  @ValidateNested({
    message: 'Invalid paywall payment info',
  })
  @Type(() => QueryPaymentRequest)
  paywall: QueryPaymentRequest;
}
