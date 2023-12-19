import { ICommonTemplate, IUserTemplate } from 'shared-types';

export const getPreviewImage = (
    template: IUserTemplate | ICommonTemplate,
    resolution = 1080,
): string => {
    return template.mediaLink
        ? template.mediaLink.thumb
        : template.templateType === 'video'
        ? template.previewUrls.find(item => item.resolution === resolution)
              ?.url ?? ''
        : template.url;
};
