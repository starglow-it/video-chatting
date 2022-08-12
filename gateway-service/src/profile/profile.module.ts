import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// const
import { JWT_ACCESS_EXPIRE } from '@shared/const/jwt.const';

// modules
import { TemplatesModule } from '../templates/templates.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CoreModule } from '../core/core.module';
import { ConfigModule } from '../config/config.module';

// services
import { ConfigClientService } from '../config/config.service';
import { ProfileService } from './profile.service';

// controllers
import { ProfileTemplatesController } from './profile-templates.controller';
import { ProfileAvatarController } from './profile-avatar.controller';
import { ProfileController } from './profile.controller';

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
  controllers: [
    ProfileController,
    ProfileTemplatesController,
    ProfileAvatarController,
  ],
  providers: [ProfileService],
})
export class ProfileModule {}
