import { Expose, Transform, Type } from 'class-transformer';
import { ICommonUser, IFeaturedBackground } from 'shared-types';
import { PreviewImageDTO } from './preview-image.dto';

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
    createdBy: IFeaturedBackground['createdBy'];

}
