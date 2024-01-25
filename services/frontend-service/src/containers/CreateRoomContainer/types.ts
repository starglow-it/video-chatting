import { BusinessCategory } from '../../store/types';

export type ParticipantPosition = {
    id: string;
    top: number;
    left: number;
};

export interface IUploadTemplateFormData {
    background?: File;
    name: string;
    description: string;
    aboutTheHost: string;
    url: string;
    youtubeUrl: string;
    previewUrls: string[];
    customLink: string;
    tags: Omit<BusinessCategory, 'id'>[];
    participantsNumber: number;
    participantsPositions: ParticipantPosition[];
    isPublic: boolean;
    templateLinks: any[];
}
