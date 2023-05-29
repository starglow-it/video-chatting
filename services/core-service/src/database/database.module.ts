import { Global, Module } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "../services/config/config.module";
import { ConfigClientService } from "../services/config/config.service";

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigClientService],
            useFactory: async (config: ConfigClientService) => {
              const uri = await config.get('mongoUri');
              return {
                uri,
              };
            },
          }),
    ],
    providers: [DatabaseService]
})
export class DatabaseModule {}