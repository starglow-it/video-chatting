import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreatePaymentRequestForRecordingVideo {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty({
    message: 'UserId must be present',
  })
  @IsString({
    message: 'Invalid userId value',
  })
  userId: string;

  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty({
    message: 'Price must be present',
  })
  @IsNumber()
  price: number;
}
