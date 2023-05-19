import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MediaCategory, MediaCategoryDocument } from "./schemas/media-category.schema";
import { Media, MediaDocument } from "./schemas/media.schema";
import { PreviewImage, PreviewImageDocument } from "./schemas/preview-image.schema";

@Controller('')
export class AppController {
    constructor(
        @InjectModel(MediaCategory.name)
        private mediaCategory: Model<MediaCategoryDocument>,
        @InjectModel(Media.name)
        private media: Model<MediaDocument>,
        @InjectModel(PreviewImage.name)
        private previewImage: Model<PreviewImageDocument>,
    ) { }
    @MessagePattern({ cmd: 'testing' })
    async getCollection(@Payload() payload) {
        console.log(payload.collection);
        return {
            list: await this[payload.collection]?.find(),
            count: await this[payload.collection]?.count()
        }
    }
}