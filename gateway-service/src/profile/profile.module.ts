import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module';
import { ConfigClientService } from '../config/config.service';
import { JWT_ACCESS_EXPIRE } from '@shared/const/jwt.const';
import { CoreModule } from '../core/core.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PassportModule } from '@nestjs/passport';
import { TemplatesModule } from '../templates/templates.module';

@Module({
  imports: [
    CoreModule,
    PassportModule,
    NotificationsModule,
    TemplatesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigClientService],
      useFactory: async (config: ConfigClientService) => {
        return {
          secret: await config.get('jwtSecret'),
          signOptions: { expiresIn: JWT_ACCESS_EXPIRE },
        };
      },
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
