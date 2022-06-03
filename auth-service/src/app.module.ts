import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// controllers
import { AppController } from './app.controller';

// services
import { AppService } from './app.service';
import { ConfigClientService } from './config/config.service';

// modules
import { ConfirmTokenModule } from './confirm-token/confirm-token.module';
import { ConfigModule } from './config/config.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { AccessTokenModule } from './access-token/access-token.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { ResetPasswordTokenModule } from './reset-password-token/reset-password-token.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigClientService],
      useFactory: async (config: ConfigClientService) => {
        const allConfig = await config.getAll();

        return {
          uri: allConfig.mongoUri,
        };
      },
    }),
    AuthModule,
    CoreModule,
    NotificationsModule,
    ConfirmTokenModule,
    AccessTokenModule,
    RefreshTokenModule,
    ResetPasswordTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
