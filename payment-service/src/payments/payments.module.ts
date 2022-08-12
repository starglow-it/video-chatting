import { Module } from '@nestjs/common';
import { StripeModule } from 'nestjs-stripe';
import { StripeOptions } from 'nestjs-stripe/lib/interfaces/StripeOptions';

// controllers
import { PaymentsController } from './payments.controller';

// services
import { PaymentsService } from './payments.service';
import { ConfigClientService } from '../config/config.service';

// modules
import { ConfigModule } from '../config/config.module';
import { CoreModule } from '../core/core.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    CoreModule,
    NotificationsModule,
    StripeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigClientService],
      useFactory: async (
        config: ConfigClientService,
      ): Promise<StripeOptions> => {
        const allConfig = await config.getAll();

        return {
          apiKey: allConfig.stripeApiKey,
          apiVersion: '2020-08-27',
        };
      },
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
