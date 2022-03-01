import { Template } from '../../../store/types';

export type TemplatePreviewDialogProps = {
    onChooseTemplate: (data: { templateId: Template['id'] }) => void;
};
