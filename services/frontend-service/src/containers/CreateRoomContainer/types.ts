import { PreviewImage } from '../../store/types';

export type ParticipantPosition = {
    id: string;
    top: number;
    left: number;
};

export interface IUploadTemplateFormData {
    background?: File;
    name: string;
    description: string;
    url: string;
    previewUrls: PreviewImage[];
    customLink: string;
    tags: string[];
    participantsNumber: number;
    participantsPositions: ParticipantPosition[];
    isPublic: boolean;
}
