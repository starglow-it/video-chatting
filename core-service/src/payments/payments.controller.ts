import { Controller } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

import { PAYMENTS_SERVICE } from '@shared/const/services.const';
import {
  CREATE_MEETING_DONATION,
  DELETE_MEETING_DONATION,
  GET_MEETING_DONATION,
} from '@shared/patterns/payments';
import { ICommonUserDTO } from '@shared/interfaces/common-user.interface';

import { PaymentsService } from './payments.service';

import { withTransaction } from '../helpers/mongo/withTransaction';

@Controller('payments')
export class PaymentsController {
  constructor(
    private paymentService: PaymentsService,
    @InjectConnection() private connection: Connection,
  ) {}

  @MessagePattern({ cmd: CREATE_MEETING_DONATION })
  async createMeetingDonation(
    @Payload() data: { userId: ICommonUserDTO['id']; paymentIntentId: string },
  ) {
    return withTransaction(this.connection, async (session) => {
      try {
        const [newDonation] = await this.paymentService.createMeetingDonation({
          data: {
            userId: data.userId,
            paymentIntentId: data.paymentIntentId,
          },
          session,
        });

        return newDonation;
      } catch (err) {
        throw new RpcException({ message: err.message, ctx: PAYMENTS_SERVICE });
      }
    });
  }

  @MessagePattern({ cmd: DELETE_MEETING_DONATION })
  async deleteMeetingDonation(@Payload() data: { paymentIntentId: string }) {
    return withTransaction(this.connection, async (session) => {
      try {
        await this.paymentService.deleteMeetingDonation({
          query: {
            paymentIntentId: data.paymentIntentId,
          },
          session,
        });

        return;
      } catch (err) {
        throw new RpcException({ message: err.message, ctx: PAYMENTS_SERVICE });
      }
    });
  }

  @MessagePattern({ cmd: GET_MEETING_DONATION })
  async getMeetingDonation(@Payload() data: { paymentIntentId: string }) {
    return withTransaction(this.connection, async (session) => {
      try {
        return this.paymentService.findMeetingDonation({
          query: {
            paymentIntentId: data.paymentIntentId,
          },
          session,
          populatePath: 'user',
        });
      } catch (err) {
        throw new RpcException({ message: err.message, ctx: PAYMENTS_SERVICE });
      }
    });
  }
}
