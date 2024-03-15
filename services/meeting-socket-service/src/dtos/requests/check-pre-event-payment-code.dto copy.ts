import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEmail } from 'class-validator';
import { ICheckPreEventPaymentCode } from 'src/interfaces/check-pre-event-payment.interface copy';
export class CheckPreEventPaymentCode implements ICheckPreEventPaymentCode {
  @IsNotEmpty()
  @IsString()
  code: string;
}
