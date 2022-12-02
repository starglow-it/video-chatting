import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../services/config/config.module';
import { ConfigClientService } from '../../services/config/config.service';
import { JWT_ACCESS_EXPIRE } from 'shared-const';
import { NotificationsModule } from '../../services/notifications/notifications.module';
import { CoreModule } from '../../services/core/core.module';
import { TemplatesModule } from '../templates/templates.module';
import { UploadModule } from '../upload/upload.module';
import { PaymentsModule } from '../payments/payments.module';
import { SocketModule } from '../../services/socket/socket.module';
import { UserTemplatesModule } from '../user-templates/user-templates.module';

@Module({
  imports: [
    PassportModule,
    PaymentsModule,
    CoreModule,
    NotificationsModule,
    TemplatesModule,
    UserTemplatesModule,
    UploadModule,
    SocketModule,
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
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
