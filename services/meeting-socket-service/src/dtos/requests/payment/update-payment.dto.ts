import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentType } from 'shared-const';
import { MeetingRole } from 'shared-types';

export class UpdatePaymentRequestDto {
  @IsNotEmpty()
  @IsString({
    message: 'invalid',
  })
  currency: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString({
    message: 'invalid',
  })
  type: PaymentType;

  @IsNotEmpty()
  @IsString({
    message: 'invalid',
  })
  meetingRole: Exclude<MeetingRole, 'host'>;

  @IsNotEmpty()
  @IsBoolean()
  enabled: boolean;
}
