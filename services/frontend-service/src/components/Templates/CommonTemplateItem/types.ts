import { Template } from '../../../store/types';

export type CommonTemplateItemProps = {
    template: Template;
    onChooseTemplate?: (templateId: Template['id']) => Promise<void> | void;
};
