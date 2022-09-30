import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// controllers

// services
import { ConfigClientService } from './services/config/config.service';

// modules
import { ConfigModule } from './services/config/config.module';
import { NotificationsModule } from './services/notifications/notifications.module';
import { CoreModule } from './services/core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { TokensModule } from './modules/tokens/tokens.module';

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
    TokensModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
