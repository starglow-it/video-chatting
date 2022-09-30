import { Module } from '@nestjs/common';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

// modules
import { ConfigModule } from '../../services/config/config.module';
import { CoreModule } from '../../services/core/core.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

// controllers
import { AuthController } from './auth.controller';

// services
import { AuthService } from './auth.service';
import { ConfigClientService } from '../../services/config/config.service';

// shared
import { AUTH_PROVIDER } from '@shared/providers';
import { JWT_ACCESS_EXPIRE } from '@shared/const/jwt.const';

// strategy
import { LocalStrategy } from '../../strategy/local.strategy';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUTH_PROVIDER,
        imports: [ConfigModule],
        inject: [ConfigClientService],
        useFactory: async (
          config: ConfigClientService,
        ): Promise<ClientProvider> => {
          const allConfig = await config.getAll();

          return {
            transport: Transport.RMQ,
            options: {
              urls: [
                `amqp://${allConfig.rabbitMqUser}:${allConfig.rabbitMqPass}@${allConfig.rabbitMqHost}`,
              ],
              queue: allConfig.rabbitMqAuthQueue,
              queueOptions: {
                durable: false,
              },
            },
          };
        },
      },
    ]),
    CoreModule,
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
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
