import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PaymentType, StripeCurrency } from 'shared-const';
import { MeetingRole } from 'shared-types';

export class CommonTemplatePaymentDto {
  @ApiProperty({
    type: String,
    example: StripeCurrency.USD,
  })
  @Expose()
  currency: string;

  @ApiProperty({
    type: Number,
    example: 5,
  })
  @Expose()
  price: number;

  @ApiProperty({
    type: String,
    example: PaymentType.Paywall,
  })
  @Expose()
  type: string;

  @ApiProperty({
    type: String,
    example: 'participant',
  })
  @Expose()
  meetingRole: Exclude<MeetingRole, 'host'>;

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  @Expose()
  enabled: boolean;
}
