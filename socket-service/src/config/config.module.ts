import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CONFIG_PROVIDER } from '@shared/providers';
import { ConfigClientService } from './config.service';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: CONFIG_PROVIDER,
        transport: Transport.TCP,
        options: {
          host: 'config-service',
          port: 4000,
        },
      },
    ]),
  ],
  providers: [ConfigClientService],
  exports: [ConfigClientService],
})
export class ConfigModule {}
