import { Template } from '../../../store/types';

export type TemplateMainInfoProps = {
    name: Template['name'];
    description: Template['description'];
    maxParticipants: Template['maxParticipants'];
    type: Template['type'];
};
