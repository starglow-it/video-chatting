import { ICommonTemplate } from 'shared-types';

export type TemplateParticipantsProps = {
    number: ICommonTemplate['maxParticipants'];
    authorRole?: ICommonTemplate['authorRole'];
    authorThumbnail?: ICommonTemplate['authorThumbnail'];
    authorName?: ICommonTemplate['authorName'];
};
