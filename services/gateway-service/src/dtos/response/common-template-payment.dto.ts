import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PaymentType, StripeCurrency } from 'shared-const';

export class CommonTemplatePaymentDto {
  @ApiProperty({
    type: String,
    example: '650d457cf03e729a754d1f83',
  })
  @Expose()
  userTemplate: string;

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
    type: Boolean,
    example: false,
  })
  @Expose()
  enabled: boolean;
}
