import { UserTemplate } from '../../../store/types';

export type ReplaceTemplateItemProps = {
    template: UserTemplate;
    onChooseTemplate?: (templateId: UserTemplate['id']) => Promise<void> | void;
};
