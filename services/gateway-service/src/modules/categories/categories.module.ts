import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CoreModule } from '../../services/core/core.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../../services/config/config.module';
import { ConfigClientService } from '../../services/config/config.service';
import { JWT_ACCESS_EXPIRE } from 'shared-const';

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
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule { }
