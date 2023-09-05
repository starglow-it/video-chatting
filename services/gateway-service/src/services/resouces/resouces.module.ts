import { Module } from '@nestjs/common';
import { ResouceService } from './resouces.service';
import { UploadModule } from '../../modules/upload/upload.module';
import { CoreModule } from '../core/core.module';

@Module({
    imports: [
        UploadModule,
        CoreModule
    ],
    providers: [ResouceService],
    exports: [ResouceService]
})
export class ResouceModule {};