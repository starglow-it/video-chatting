import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEmail } from 'class-validator';
import { IGeneratePreEventPaymentCode } from 'src/interfaces/generate-pre-event-payment.interface';
export class GeneratePreEventPaymentCode implements IGeneratePreEventPaymentCode {
  @IsOptional()
  // @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  templateId: string;
}
