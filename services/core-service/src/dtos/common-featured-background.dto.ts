import { Expose, Transform, Type } from 'class-transformer';
import { ICommonUser, IFeaturedBackground, IFeaturedBackgroundUser, ITemplateUser } from 'shared-types';
import { PreviewImageDTO } from './preview-image.dto';
import { FeaturedBackgroundUserDto } from './featured-background-user.dto';

export class CommonFeatureBackgroundDTO implements IFeaturedBackground {
    @Expose()
    @Transform((data) => data.obj['_id'])
    id: string;

    @Expose()
    url: IFeaturedBackground['url'];

    @Expose()
    @Type(() => PreviewImageDTO)
    previewUrls: IFeaturedBackground['previewUrls'];

    @Expose()
    type: IFeaturedBackground['type'];

    @Expose()
    @Type(() => FeaturedBackgroundUserDto)
    createdBy: IFeaturedBackgroundUser;

}
