import { Module } from '@nestjs/common';
import { TemplatePaymentsComponent } from './template-payments.component';
import { TemplatePaymentsService } from './template-payments.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TemplatePayment,
  TemplatePaymentSchema,
} from '../../schemas/template-payment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TemplatePayment.name,
        schema: TemplatePaymentSchema,
      },
    ]),
  ],
  providers: [TemplatePaymentsComponent, TemplatePaymentsService],
  exports: [TemplatePaymentsComponent, TemplatePaymentsService],
})
export class TemplatePaymentsModule {}
