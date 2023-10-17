import { Controller } from '@nestjs/common';
import { TemplatePaymentsComponent } from './template-payments.component';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  TEMPLATES_SERVICE,
  TemplateNativeErrorEnum,
  TemplatePaymentsBrokerPatterns,
  UserTemplatesBrokerPatterns,
} from 'shared-const';
import {
  EntityList,
  ITemplatePayment,
  UpdateTemplatePaymentPayload,
} from 'shared-types';
import { withTransaction } from 'src/helpers/mongo/withTransaction';
import { Connection, FilterQuery } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { UserTemplatesComponent } from '../user-templates/user-templates.component';
import { TemplatePaymentsService } from './template-payments.service';
import {
  TemplatePayment,
  TemplatePaymentDocument,
} from 'src/schemas/user-payment.schema';
import { templatePaymentSerialization } from 'src/dtos/template-payment.dto';
import { throwRpcError } from '../../utils/common/throwRpcError';

@Controller('template-payment')
export class TemplatePaymentsController {
  constructor(
    @InjectConnection() private connection: Connection,
    private readonly templatePaymentsComponent: TemplatePaymentsComponent,
    private readonly userTemplatesComponent: UserTemplatesComponent,
    private readonly templatePaymentsService: TemplatePaymentsService,
  ) {}

  @MessagePattern({
    cmd: TemplatePaymentsBrokerPatterns.UpdateTemplatePayments,
  })
  async updateUserTemplatePayment(
    @Payload() { userTemplateId, data, userId }: UpdateTemplatePaymentPayload,
  ): Promise<EntityList<ITemplatePayment>> {
    return withTransaction(this.connection, async (session) => {
      try {
        const template = await this.userTemplatesComponent.findById(
          userTemplateId,
          session,
        );

        throwRpcError(
          template.user.toString() !== userId,
          TemplateNativeErrorEnum.NOT_TEMPLATE_OWNER,
        );

        const query: FilterQuery<TemplatePaymentDocument> = {
          userTemplate: template._id,
          type: {
            $in: Object.keys(data),
          },
        };

        const templatePayments = await this.templatePaymentsService.find({
          query,
          session,
        });

        const countTemplatePayments = await this.templatePaymentsService.count(
          query,
        );

        const promises: Promise<TemplatePaymentDocument>[] = [];

        if (templatePayments.length) {
          const p = templatePayments.map(async ({ type, _id }) => {
            return this.templatePaymentsComponent.findOneAndUpdate({
              query: {
                _id,
                type,
              },
              data: {
                ...data[type],
              },
              session,
            });
          });
          promises.push(...p);
        }

        const plainTemplatePayments = templatePaymentSerialization(
          await Promise.all(promises),
        );

        return {
          list: plainTemplatePayments,
          count: countTemplatePayments,
        };
      } catch (err) {
        throw new RpcException({
          message: err.message,
          ctx: TEMPLATES_SERVICE,
        });
      }
    });
  }
}
