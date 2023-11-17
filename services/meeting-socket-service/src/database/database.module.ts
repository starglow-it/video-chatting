import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongo:27017/theliveoffice', {
      keepAlive: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
    }),
  ],
  providers: [DatabaseService],
})
export class DatabaseModule {}
