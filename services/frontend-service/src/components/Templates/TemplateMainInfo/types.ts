import { PropsWithClassName } from 'shared-frontend/types';
import { ICommonTemplate } from 'shared-types';

export type TemplateMainInfoProps = PropsWithClassName<{
    name: ICommonTemplate['name'];
    description: ICommonTemplate['description'];
    maxParticipants: ICommonTemplate['maxParticipants'];
    type: ICommonTemplate['type'];
    priceInCents?: ICommonTemplate['priceInCents'];
    isNeedToShowBusinessInfo?: boolean;
    show: boolean;
    isPublic?: boolean;
    isCommonTemplate?: boolean;
    authorRole: ICommonTemplate['authorRole'];
    authorThumbnail?: ICommonTemplate['authorThumbnail'];
    authorName: ICommonTemplate['authorName'];
}>;
