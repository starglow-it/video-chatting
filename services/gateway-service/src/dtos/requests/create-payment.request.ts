import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PaymentType } from 'shared-const';
import { MeetingRole } from 'shared-types';

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
    type: String,
    enum: Object.values(PaymentType),
    example: PaymentType.Meeting,
  })
  @IsNotEmpty({
    message: 'PaymentPaywall must be present',
  })
  @IsString({
    message: ' IsValid PaymentPaywall value',
  })
  paymentType: PaymentType;

  @ApiProperty({
    type: String,
    enum: Object.values(MeetingRole),
    example: MeetingRole.Audience,
  })
  @IsNotEmpty({
    message: 'PaymentPaywall must be present',
  })
  @IsString({
    message: ' IsValid PaymentPaywall value',
  })
  meetingRole: MeetingRole;
}
