import { Expose, Transform, Type } from 'class-transformer';
import { ITemplatePayment, IUserTemplate } from 'shared-types';
import { UserTemplateDTO } from './user-template.dto';
import { TemplatePaymentDocument } from 'src/schemas/user-payment.schema';
import { serializeInstance } from 'shared-utils';

export class TemplatePaymentDto implements ITemplatePayment {
  @Expose()
  @Transform((data) => data.obj['_id'])
  userTemplate: IUserTemplate;

  @Expose()
  currency: string;

  @Expose()
  price: number;

  @Expose()
  type: string;

  @Expose()
  enabled: boolean;
}

export const templatePaymentSerialization = <
  D extends TemplatePaymentDocument | TemplatePaymentDocument[],
>(
  templatePayment: D,
) => serializeInstance(templatePayment, TemplatePaymentDto);
