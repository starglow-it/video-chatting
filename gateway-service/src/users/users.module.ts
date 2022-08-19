import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module';
import { ConfigClientService } from '../config/config.service';
import { JWT_ACCESS_EXPIRE } from '@shared/const/jwt.const';
import { NotificationsModule } from '../notifications/notifications.module';
import { CoreModule } from '../core/core.module';
import { UserTemplateController } from './user-templates.contoller';
import { TemplatesModule } from '../templates/templates.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    PassportModule,
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
    CoreModule,
    NotificationsModule,
    TemplatesModule,
    UploadModule,
  ],
  controllers: [UsersController, UserTemplateController],
  providers: [UsersService],
})
export class UsersModule {}
