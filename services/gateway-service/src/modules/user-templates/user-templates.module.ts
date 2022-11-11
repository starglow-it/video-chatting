import { Module } from '@nestjs/common';
import { UserTemplatesController } from './user-templates.controller';
import { UserTemplatesService } from './user-templates.service';
import {CoreModule} from "../../services/core/core.module";
import {TemplatesModule} from "../templates/templates.module";

@Module({
  imports: [
    CoreModule,
    TemplatesModule,
  ],
  controllers: [UserTemplatesController],
  providers: [UserTemplatesService],
  exports: [UserTemplatesService]
})
export class UserTemplatesModule {}
