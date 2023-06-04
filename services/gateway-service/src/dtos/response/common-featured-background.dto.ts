import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { ICommonUser, IFeaturedBackground, IPreviewImage } from "shared-types";
import { PreviewImageDTO } from "./common.dto";
import { UserFeaturedBackground } from "./common-user.dto";

export class CommonFeatureBackgroundDto implements IFeaturedBackground {
    @Expose()
    @ApiProperty()
    id: string;
    
    @Expose()
    @ApiProperty({
        type: UserFeaturedBackground
    })
    createdBy: IFeaturedBackground['createdBy'];

    @Expose()
    @ApiProperty({
        type: String
    })
    url: IFeaturedBackground['url'];

    @Expose()
    @ApiProperty({
        type: [PreviewImageDTO]
    })
    previewUrls: IPreviewImage[];

    @Expose()
    @ApiProperty({
        type: String
    })
    type: IFeaturedBackground['type'];
}