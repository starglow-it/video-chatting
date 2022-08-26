import { Template } from '../../../store/types';

export type TemplatePreviewDialogProps = {
    onChooseTemplate: (templateId: Template['id']) => void;
    chooseButtonKey: string;
    isNeedToRenderTemplateInfo: boolean;
    onSchedule?: ((data: { templateId: Template['id'] }) => void) | undefined;
};
