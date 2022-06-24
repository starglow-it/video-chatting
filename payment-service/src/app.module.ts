import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from "./payments/payments.module";
import {ConfigModule} from "./config/config.module";
import {CoreModule} from "./core/core.module";

@Module({
  imports: [
      ConfigModule,
      PaymentsModule,
      CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
