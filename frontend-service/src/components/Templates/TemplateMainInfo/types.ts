import { ProfileAvatar, Template } from '../../../store/types';
import { PropsWithClassName } from '../../../types';

export type TemplateMainInfoProps = PropsWithClassName<{
    name: Template['name'];
    description: Template['description'];
    maxParticipants: Template['maxParticipants'];
    type: Template['type'];
    isNeedToShowBusinessInfo?: boolean;
    avatar?: ProfileAvatar['url'];
    show: boolean;
}>;
