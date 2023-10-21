import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class PaymentIntentData {
  @Expose()
  @ApiProperty({
    type: String,
  })
  id: string;

  @Expose()
  @ApiProperty({
    type: String,
  })
  clientSecret: string;
}

export class PaymentIntentRestDto {
  @Expose()
  @ApiProperty({
    type: PaymentIntentData,
  })
  @Type(() => PaymentIntentData)
  paymentIntent: PaymentIntentData;
}
