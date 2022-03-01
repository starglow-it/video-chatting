import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailRequest } from '@shared/requests/sendEmail.request';

@Injectable()
export class NotificationsService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(data: SendEmailRequest) {
    await this.mailerService.sendMail({
      to: data.to,
      html: data.message,
    });
  }
}
