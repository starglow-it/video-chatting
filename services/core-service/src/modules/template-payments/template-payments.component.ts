import { Injectable } from '@nestjs/common';
import { TemplatePaymentsService } from './template-payments.service';
import { TemplatePaymentDocument } from '../../schemas/template-payment.schema';
import {
  GetModelMultipleQuery,
  GetModelSingleQuery,
  UpdateModelSingleQuery,
} from '../../types/custom';
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

  async findOne(args: GetModelSingleQuery<TemplatePaymentDocument>) {
    const p = await this.templatePaymemntsService.findOne(args);
    throwRpcError(!p, TemplateNativeErrorEnum.TEMPLATE_PAYMENT_NOT_FOUND);
    return p;
  }

  async findMany(args: GetModelMultipleQuery<TemplatePaymentDocument>) {
    const p = await this.templatePaymemntsService.find(args);
    throwRpcError(
      p.length < 2,
      TemplateNativeErrorEnum.TEMPLATE_PAYMENT_NOT_FOUND,
    );
    return p;
  }
}
