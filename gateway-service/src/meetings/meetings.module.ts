import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// controllers
import { MeetingsController } from './meetings.controller';
// services
import { MeetingsService } from './meetings.service';
import { ConfigClientService } from '../config/config.service';

// modules
import { CoreModule } from '../core/core.module';
import { ConfigModule } from '../config/config.module';

// const
import { JWT_ACCESS_EXPIRE } from '@shared/const/jwt.const';

@Module({
  imports: [
    CoreModule,
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
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService],
})
export class MeetingsModule {}
