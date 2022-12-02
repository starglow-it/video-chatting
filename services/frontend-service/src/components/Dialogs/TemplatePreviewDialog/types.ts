import {
	ICommonTemplate 
} from 'shared-types';

export type TemplatePreviewDialogProps = {
    onChooseTemplate: (templateId: ICommonTemplate['id']) => void;
    chooseButtonKey: string;
    isNeedToRenderTemplateInfo: boolean;
    onSchedule?:
        | ((data: { templateId: ICommonTemplate['id'] }) => void)
        | undefined;
};
