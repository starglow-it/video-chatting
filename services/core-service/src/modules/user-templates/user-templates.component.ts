import { Injectable } from '@nestjs/common';
import { UserTemplatesService } from './user-templates.service';
import { ITransactionSession } from 'src/helpers/mongo/withTransaction';
import { CustomPopulateOptions } from 'src/types/custom';
import { throwRpcError } from 'src/utils/common/throwRpcError';
import {
  PaymentType,
  StripeCurrency,
  TemplateNativeErrorEnum,
} from 'shared-const';
import { UserTemplateDocument } from '../../schemas/user-template.schema';
import { TemplatePaymentsService } from '../template-payments/template-payments.service';
import { TemplatePaymentDocument } from 'src/schemas/user-payment.schema';
import { FilterQuery } from 'mongoose';

@Injectable()
export class UserTemplatesComponent {
  constructor(
    private readonly userTemplatesService: UserTemplatesService,
    private readonly templatePaymentsService: TemplatePaymentsService,
  ) {}

  async findById(
    id: string,
    session: ITransactionSession,
    populate?: CustomPopulateOptions,
  ) {
    const template = await this.userTemplatesService.findById({
      id,
      session,
      populatePaths: populate,
    });
    throwRpcError(!template, TemplateNativeErrorEnum.USER_TEMPLATE_NOT_FOUND);
    return template;
  }

  async createUserTemplate(
    data: Partial<UserTemplateDocument>,
    session: ITransactionSession,
  ) {
    const [userTemplate] = await this.userTemplatesService.createUserTemplate(
      data,
      session,
    );

    const defaultPayment = {
      enabled: false,
      currency: StripeCurrency.USD,
      price: 5,
      templateId: userTemplate.templateId,
      userTemplate: userTemplate._id,
      user: userTemplate.user,
    };

    await this.templatePaymentsService.createMany({
      data: [
        {
          type: PaymentType.Meeting,
          ...defaultPayment,
        },
        {
          type: PaymentType.Paywall,
          ...defaultPayment,
        },
      ],
      session,
    });

    return userTemplate;
  }

  async deleteUserTemplates(
    query: FilterQuery<UserTemplateDocument>,
    session: ITransactionSession,
  ) {
    await this.userTemplatesService.deleteUserTemplates({
      query,
      session,
    });
    await this.templatePaymentsService.deleteMany({
      query: {
        templateId: query.templateId,
      },
      session,
    });
  }

  async deleteLeastUserTemplates(
    { templatesIds, userId }: { templatesIds: string[]; userId: string },
    session: ITransactionSession,
  ) {
    await this.userTemplatesService.deleteUserTemplates({
      query: {
        _id: { $nin: templatesIds },
        user: userId,
      },
      session,
    });

    await this.templatePaymentsService.deleteMany({
      query: {
        userTemplate: {
          $nin: templatesIds,
        },
      },
      session,
    });
  }

  async deleteUserTemplate(
    query: FilterQuery<UserTemplateDocument>,
    session: ITransactionSession,
  ) {
    console.log(query);
    
    await this.userTemplatesService.deleteUserTemplate(query, session);
    await this.templatePaymentsService.deleteMany({
      query: {
        userTemplate: new Object(query._id),
      },
      session,
    });
  }

  async deleteUserTemplatesByUserId(
    userId: string,
    session: ITransactionSession,
  ) {
    await this.userTemplatesService.deleteUserTemplates({
      query: {
        user: new Object(userId),
      },
      session,
    });
    await this.templatePaymentsService.deleteMany({
      query: {
        user: new Object(userId),
      },
      session,
    });
  }
}
