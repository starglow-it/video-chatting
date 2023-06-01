import { Module } from "@nestjs/common";
import { AwsConnectorModule } from "src/services/aws-connector/aws-connector.module";
import { FeaturedBackgroundsController } from "./feature-backgrounds.controller";
import { FeaturedBackgroundsService } from "./featured-backgrounds.service";
import { MongooseModule } from "@nestjs/mongoose";
import { FeaturedBackground, FeaturedBackgroundSchema } from "src/schemas/featured-background.schema";
import { PreviewImage, PreviewImageSchema } from "src/schemas/preview-image.schema";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [
        AwsConnectorModule,
        UsersModule,
        MongooseModule.forFeature([
            { name: FeaturedBackground.name, schema: FeaturedBackgroundSchema },
            { name: PreviewImage.name, schema: PreviewImageSchema },
        ])
    ],
    controllers: [FeaturedBackgroundsController],
    providers: [FeaturedBackgroundsService],

})
export class FeaturedBackgroundsModule { }