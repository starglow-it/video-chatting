import { Module } from "@nestjs/common";
import { AwsConnectorModule } from "src/services/aws-connector/aws-connector.module";
import { FeaturedBackgroundsController } from "./feature-backgrounds.controller";
import { FeaturedBackgroundsService } from "./featured-backgrounds.service";

@Module({
    imports: [
        AwsConnectorModule
    ],
    controllers: [FeaturedBackgroundsController],
    providers: [FeaturedBackgroundsService],

})
export class FeaturedBackgroundsModule {}