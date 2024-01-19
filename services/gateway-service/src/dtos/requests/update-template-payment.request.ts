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
import { MeetingRole } from 'shared-types';

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
  @IsBoolean({ message: 'Enabled must be boolean' })
  enabled: boolean;
}

class QueryTemplatePaymentsRequest
  implements Record<Exclude<MeetingRole, 'host'>, UpdateTemplatePaymentsData>
{
  @ApiProperty({
    type: UpdateTemplatePaymentsData,
  })
  @IsNotEmpty()
  @Type(() => UpdateTemplatePaymentsData)
  participant: UpdateTemplatePaymentsData;

  @ApiProperty({
    type: UpdateTemplatePaymentsData,
  })
  @IsNotEmpty()
  @Type(() => UpdateTemplatePaymentsData)
  audience: UpdateTemplatePaymentsData;
}

export class UpdateTemplatePaymentsRequest {
  @ApiProperty({
    type: QueryTemplatePaymentsRequest,
  })
  @IsOptional()
  @Type(() => QueryTemplatePaymentsRequest)
  meeting?: QueryTemplatePaymentsRequest;

  @ApiProperty({
    type: QueryTemplatePaymentsRequest,
  })
  @IsOptional()
  @Type(() => QueryTemplatePaymentsRequest)
  paywall?: QueryTemplatePaymentsRequest;
}
