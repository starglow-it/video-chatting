import { Module } from '@nestjs/common';
import { TemplatePaymentsComponent } from './template-payments.component';
import { TemplatePaymentsService } from './template-payments.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TemplatePayment,
  TemplatePaymentSchema,
} from '../../schemas/user-payment.schema';
import { UserTemplatesModule } from '../user-templates/user-templates.module';
import { UserTemplatesService } from '../user-templates/user-templates.service';
import { AwsConnectorService } from 'src/services/aws-connector/aws-connector.service';

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
