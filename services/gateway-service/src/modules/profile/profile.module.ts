import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// const
import { JWT_ACCESS_EXPIRE } from 'shared-const';

// modules
import { TemplatesModule } from '../templates/templates.module';
import { NotificationsModule } from '../../services/notifications/notifications.module';
import { CoreModule } from '../../services/core/core.module';
import { ConfigModule } from '../../services/config/config.module';
import { UploadModule } from '../upload/upload.module';
import { UserTemplatesModule } from '../user-templates/user-templates.module';

// services
import { ConfigClientService } from '../../services/config/config.service';
import { ProfileService } from './profile.service';

// controllers
import { ProfileTemplatesController } from './profile-templates.controller';
import { ProfileAvatarController } from './profile-avatar.controller';
import { ProfileController } from './profile.controller';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    CoreModule,
    PassportModule,
    NotificationsModule,
    TemplatesModule,
    UserTemplatesModule,
    UploadModule,
    PaymentsModule,
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
