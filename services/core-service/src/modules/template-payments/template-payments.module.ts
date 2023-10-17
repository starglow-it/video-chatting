import { Module } from '@nestjs/common';
import { TemplatePaymentsController } from './template-payments.controller';
import { TemplatePaymentsComponent } from './template-payments.component';
import { TemplatePaymentsService } from './template-payments.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TemplatePayment,
  TemplatePaymentSchema,
} from '../../schemas/user-payment.schema';
import { UserTemplatesModule } from '../user-templates/user-templates.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TemplatePayment.name,
        schema: TemplatePaymentSchema,
      },
    ]),
    UserTemplatesModule,
  ],
  controllers: [TemplatePaymentsController],
  providers: [TemplatePaymentsComponent, TemplatePaymentsService],
  exports: [TemplatePaymentsComponent, TemplatePaymentsService],
})
export class TemplatePaymentsModule {}
