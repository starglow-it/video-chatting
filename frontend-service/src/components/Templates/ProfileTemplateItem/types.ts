import { UserTemplate } from '../../../store/types';

export type ProfileTemplateProps = {
    template: UserTemplate;
    onChooseTemplate?: (templateId: UserTemplate['id']) => void;
};
