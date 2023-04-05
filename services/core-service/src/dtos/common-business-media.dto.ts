import { Expose, Transform, Type } from 'class-transformer';
import { IBusinessCategory, IBusinessMedia } from 'shared-types';
import { CommonBusinessCategoryDTO } from './common-business-category.dto';
import { PreviewImageDTO } from './preview-image.dto';

export class CommonBusinessMediaDTO implements IBusinessMedia {
    @Expose()
    @Transform((data) => data.obj['_id'])
    id: string;

    @Expose()
    @Type(() => CommonBusinessCategoryDTO)
    businessCategory: IBusinessMedia['businessCategory'];
    
    @Expose()
    url: string;

    @Expose()
    @Type(() => PreviewImageDTO)
    previewUrls: IBusinessMedia['previewUrls'];
}
