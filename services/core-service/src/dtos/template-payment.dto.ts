import { Expose, Transform, Type } from 'class-transformer';
import { ITemplatePayment, IUserTemplate, MeetingRole } from 'shared-types';
import { UserTemplateDTO } from './user-template.dto';
import { TemplatePaymentDocument } from 'src/schemas/template-payment.schema';
import { serializeInstance } from 'shared-utils';

export class TemplatePaymentDto implements ITemplatePayment {
  @Expose()
  @Transform((data) => data.obj['_id'])
  userTemplate: string;

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
