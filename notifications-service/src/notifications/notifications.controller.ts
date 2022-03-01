import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

// shared
import { ResponseSumType } from '@shared/response/common.response';
import { SendEmailRequest } from '@shared/requests/sendEmail.request';
import { SEND_EMAIL_PATTERN } from '@shared/patterns/notifications';

// service
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @MessagePattern({ cmd: SEND_EMAIL_PATTERN })
  async sendEmail(
    @Payload() sendEmail: SendEmailRequest,
  ): Promise<ResponseSumType<null>> {
    await this.notificationsService.sendEmail(sendEmail);

    return {
      success: true,
      result: null,
    };
  }
}
