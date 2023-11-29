import { Injectable } from '@nestjs/common';
import { UserTemplatesService } from './user-templates.service';
import { ITransactionSession } from '../../helpers/mongo/withTransaction';
import { CustomPopulateOptions } from '../../types/custom';
import { throwRpcError } from '../../utils/common/throwRpcError';
import {
  DEFAULT_PRICE,
  PaymentType,
  StripeCurrency,
  TemplateNativeErrorEnum,
} from 'shared-const';
import { UserTemplateDocument } from '../../schemas/user-template.schema';
import { TemplatePaymentsService } from '../template-payments/template-payments.service';
import { FilterQuery } from 'mongoose';
import { MeetingRole } from 'shared-types';
import { TemplatePaymentDocument } from '../../schemas/template-payment.schema';
import { MediaService } from '../medias/medias.service';

@Injectable()
export class UserTemplatesComponent {
  constructor(
    private readonly userTemplatesService: UserTemplatesService,
    private readonly templatePaymentsService: TemplatePaymentsService,
    private readonly mediaService: MediaService,
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

  async findOne(
    query: FilterQuery<UserTemplateDocument>,
    session: ITransactionSession,
    populate?: CustomPopulateOptions,
  ) {
    const template = await this.userTemplatesService.findUserTemplate({
      query,
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
      price: DEFAULT_PRICE.participant,
      templateId: userTemplate.templateId,
      userTemplate: userTemplate._id,
      user: userTemplate.user,
      meetingRole: MeetingRole.Participant as Exclude<MeetingRole, 'host'>,
    };

    const meetingPaymentRoleData: {
      [K in Exclude<MeetingRole, 'host'>]: Partial<TemplatePaymentDocument>;
    } = {
      participant: { ...defaultPayment },
      lurker: {
        ...defaultPayment,
        meetingRole: MeetingRole.Lurker,
        price: DEFAULT_PRICE.lurker,
      },
    };

    await this.templatePaymentsService.createMany({
      data: [
        {
          type: PaymentType.Meeting,
          ...meetingPaymentRoleData['participant'],
        },
        {
          type: PaymentType.Paywall,
          ...meetingPaymentRoleData['lurker'],
        },
        {
          type: PaymentType.Meeting,
          ...meetingPaymentRoleData['lurker'],
        },
        {
          type: PaymentType.Paywall,
          meetingRole: MeetingRole.Participant,
          ...meetingPaymentRoleData['participant'],
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
        user: userId,
      },
      session,
    });

    await this.mediaService.deleteMedias({
      query: {
        userTemplate: {
          $nin: [...templatesIds, null],
        },
      },
    });
  }

  async deleteUserTemplate(
    query: FilterQuery<UserTemplateDocument>,
    session: ITransactionSession,
  ) {
    await this.userTemplatesService.deleteUserTemplate(query, session);
    if (query._id) {
      await this.templatePaymentsService.deleteMany({
        query: {
          userTemplate: new Object(query._id),
        },
        session,
      });
    }
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
