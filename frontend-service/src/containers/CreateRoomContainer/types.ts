export type ParticipantPosition = {
    id: string;
    top: number;
    left: number;
};

export interface IUploadTemplateFormData {
    background?: {
        file: File;
        dataUrl: string;
    };
    name: string;
    description: string;
    customLink: string;
    tags: string[];
    participantsNumber: number;
    participantsPositions: ParticipantPosition[];
}
