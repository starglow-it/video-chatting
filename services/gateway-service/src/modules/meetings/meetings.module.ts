import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// controllers
import { MeetingsController } from './meetings.controller';

// services
import { MeetingsService } from './meetings.service';
import { ConfigClientService } from '../../services/config/config.service';

// modules
import { CoreModule } from '../../services/core/core.module';
import { ConfigModule } from '../../services/config/config.module';
import { TemplatesModule } from '../templates/templates.module';
import { MediaServerModule } from '../../services/media-server/media-server.module';
import { ScalingModule } from '../../services/scaling/scaling.module';
import { UserTemplatesModule } from '../user-templates/user-templates.module';

// const
import { JWT_ACCESS_EXPIRE } from 'shared-const';

@Module({
  imports: [
    CoreModule,
    MediaServerModule,
    ScalingModule,
    TemplatesModule,
    UserTemplatesModule,
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
