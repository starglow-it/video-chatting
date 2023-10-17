import { Injectable } from '@nestjs/common';
import { TemplatePaymentsService } from './template-payments.service';
import { FilterQuery } from 'mongoose';
import { TemplatePaymentDocument } from '../../schemas/user-payment.schema';
import { UpdateModelSingleQuery } from '../../types/custom';
import { throwRpcError } from '../../utils/common/throwRpcError';
import { TemplateNativeErrorEnum } from 'shared-const';

@Injectable()
export class TemplatePaymentsComponent {
  constructor(
    private readonly templatePaymemntsService: TemplatePaymentsService,
  ) {}

  async findOneAndUpdate(
    args: UpdateModelSingleQuery<TemplatePaymentDocument>,
  ): Promise<TemplatePaymentDocument> {
    const p = await this.templatePaymemntsService.findOneAndUpdate(args);
    throwRpcError(!p, TemplateNativeErrorEnum.TEMPLATE_PAYMENT_NOT_FOUND);
    return p;
  }
}
