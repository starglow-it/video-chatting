import {ICommonTemplate} from "shared-types";

export const DEFAULT_TEMPLATE_DATA: Omit<ICommonTemplate, 'templateId'> = {
    url: '',
    name: '',
    maxParticipants: 1,
    description: '',
    shortDescription: '',
    previewUrls: [],
    type: 'free',
    usersPosition: [],
    isAudioAvailable: true,
    draft: true,
    isPublic: false,
    templateType: 'video',
}