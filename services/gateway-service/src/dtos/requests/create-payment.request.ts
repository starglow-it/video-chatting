import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentRequest {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty({
    message: 'TemplateId must be present',
  })
  @IsString({
    message: 'Invalid templateId value',
  })
  templateId: string;

  @ApiProperty({
    type: Boolean,
  })
  @IsNotEmpty({
    message: 'IsPaymentPaywall must be present',
  })
  @IsBoolean({
    message: ' isValid IsPaymentPaywall value',
  })
  isPaymentPaywall: boolean;
}
