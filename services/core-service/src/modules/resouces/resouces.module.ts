import { Module } from '@nestjs/common';
import { ResoucesController } from './resouces.controller';
import { ResoucesService } from './resouces.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Resouce, ResouceSchema } from '../../schemas/resouce.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Resouce.name, schema: ResouceSchema },
          ]),
    ],
    controllers: [ResoucesController],
    providers: [ResoucesService],
    exports: [ResoucesService]
})
export class ResouceModule {};