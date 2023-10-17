import { Injectable } from '@nestjs/common';
import { UserTemplatesService } from './user-templates.service';
import { ITransactionSession } from 'src/helpers/mongo/withTransaction';
import { CustomPopulateOptions } from 'src/types/custom';
import { throwRpcError } from 'src/utils/common/throwRpcError';
import { TemplateNativeErrorEnum } from 'shared-const';

@Injectable()
export class UserTemplatesComponent {
  constructor(private readonly userTemplatesService: UserTemplatesService) {}

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
}
