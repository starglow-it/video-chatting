import {Global, Module} from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../services/config/config.module';
import { ConfigClientService } from '../../services/config/config.service';
import { JWT_ACCESS_EXPIRE } from 'shared-const';
import { NotificationsModule } from '../../services/notifications/notifications.module';
import { SocketModule } from '../../services/socket/socket.module';

@Global()
@Module({
  imports: [
    PassportModule,
    NotificationsModule,
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
  exports: [UsersService]
})
export class UsersModule {}
