import { Expose } from 'class-transformer';
import { ITemplatePayment, MeetingRole } from 'shared-types';
import { TemplatePaymentDocument } from '../schemas/template-payment.schema';
import { serializeInstance } from 'shared-utils';

export class TemplatePaymentDto implements ITemplatePayment {
  @Expose()
  currency: string;

  @Expose()
  price: number;

  @Expose()
  type: string;

  @Expose()
  meetingRole: Exclude<MeetingRole, 'host'>;

  @Expose()
  enabled: boolean;
}

export const templatePaymentSerialization = <
  D extends TemplatePaymentDocument | TemplatePaymentDocument[],
>(
  templatePayment: D,
) => serializeInstance(templatePayment, TemplatePaymentDto);
