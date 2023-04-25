import { Expose, Transform, Type } from 'class-transformer';
import { IMedia, IUserTemplate, IUserTemplateMedia } from 'shared-types';
import { CommonMediaCategoryDTO } from './common-media-categories.dto';
import { PreviewImageDTO } from './preview-image.dto';
import { UserTemplateDTO } from './user-template.dto';

export class CommonUserTemplateMediaDTO implements IUserTemplateMedia {
    @Expose()
    @Transform((data) => data.obj['_id'])
    id: string;

    @Expose()
    @Type(() => CommonMediaCategoryDTO)
    mediaCategory: IUserTemplateMedia['mediaCategory'];

    @Expose()
    url: IUserTemplateMedia['url'];

    @Expose()
    name: IUserTemplateMedia['name'];

    @Expose()
    @Type(() => PreviewImageDTO)
    previewUrls: IUserTemplateMedia['previewUrls'];

    @Expose()
    type: IUserTemplateMedia['type'];

    @Expose()
    @Type(() => UserTemplateDTO)
    userTemplate: IUserTemplateMedia['userTemplate'];
}
