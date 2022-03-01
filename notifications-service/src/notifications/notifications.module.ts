import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

// controllers
import { NotificationsController } from './notifications.controller';

// modules
import { ConfigModule } from '../config/config.module';

// services
import { ConfigClientService } from '../config/config.service';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigClientService],
      useFactory: async (config: ConfigClientService) => {
        const allConfig = await config.getAll();

        return {
          transport: {
            host: allConfig.smtpHost,
            secure: true,
            port: parseInt(allConfig.smtpPort, 10),
            auth: {
              user: allConfig.smtpUser,
              pass: allConfig.smtpPass,
            },
          },
          defaults: {
            subject: 'The LiveOffice',
            from: `"The LiveOffice" <${allConfig.smtpUser}>`,
          },
        };
      },
    }),
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
