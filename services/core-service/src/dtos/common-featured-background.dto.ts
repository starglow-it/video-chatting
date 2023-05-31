import { Expose, Transform, Type } from 'class-transformer';
import { ICommonUser, IFeatureBackground } from 'shared-types';
import { PreviewImageDTO } from './preview-image.dto';

export class CommonFeatureBackgroundDTO implements IFeatureBackground {
    @Expose()
    @Transform((data) => data.obj['_id'])
    id: string;

    @Expose()
    name: IFeatureBackground['name'];

    @Expose()
    url: string;

    @Expose()
    @Type(() => PreviewImageDTO)
    previewUrls: IFeatureBackground['previewUrls'];

    @Expose()
    type: IFeatureBackground['type'];

    @Expose()
    createBy: ICommonUser;

}
