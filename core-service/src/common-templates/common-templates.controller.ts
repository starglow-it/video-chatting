import { Controller } from '@nestjs/common';
import { Connection } from 'mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { InjectConnection } from '@nestjs/mongoose';

//  const
import {
  GET_COMMON_TEMPLATE,
  GET_COMMON_TEMPLATES,
} from '@shared/patterns/templates';
import { TEMPLATES_SERVICE } from '@shared/const/services.const';

// types
import { ICommonTemplate } from '@shared/interfaces/common-template.interface';
import { EntityList } from '@shared/types/utils/http/list.type';

// dtos
import { CommonTemplateDTO } from '../dtos/common-template.dto';

// services
import { CommonTemplatesService } from './common-templates.service';

// helpers
import { withTransaction } from '../helpers/mongo/withTransaction';

@Controller('common-templates')
export class CommonTemplatesController {
  constructor(
    @InjectConnection() private connection: Connection,
    private commonTemplatesService: CommonTemplatesService,
  ) {}

  @MessagePattern({ cmd: GET_COMMON_TEMPLATES })
  async getCommonTemplates(
    @Payload() { skip = 0, limit = 6 }: { skip: number; limit: number },
  ): Promise<EntityList<ICommonTemplate>> {
    try {
      return withTransaction(this.connection, async (session) => {
        const commonTemplates =
          await this.commonTemplatesService.findCommonTemplates({
            query: {},
            options: { skip, limit },
            populatePaths: 'businessCategories',
            session,
          });

        const commonTemplatesCount =
          await this.commonTemplatesService.countCommonTemplates();

        const parsedTemplates = plainToClass(
          CommonTemplateDTO,
          commonTemplates,
          {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
          },
        );

        return {
          list: parsedTemplates,
          count: commonTemplatesCount,
        };
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }

  @MessagePattern({ cmd: GET_COMMON_TEMPLATE })
  async getCommonTemplate(
    @Payload() { id }: { id: ICommonTemplate['id'] },
  ): Promise<ICommonTemplate> {
    try {
      return withTransaction(this.connection, async (session) => {
        const commonTemplates =
          await this.commonTemplatesService.findCommonTemplateById({
            templateId: id,
            session,
            populatePaths: 'businessCategories',
          });

        return plainToClass(CommonTemplateDTO, commonTemplates, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        });
      });
    } catch (err) {
      throw new RpcException({
        message: err.message,
        ctx: TEMPLATES_SERVICE,
      });
    }
  }
}
