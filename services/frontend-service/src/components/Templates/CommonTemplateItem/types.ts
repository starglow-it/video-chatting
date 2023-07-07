import { ICommonTemplate } from 'shared-types';

export type CommonTemplateItemProps = {
    template: ICommonTemplate;
    onChooseTemplate?: (
        templateId: ICommonTemplate['id'],
    ) => Promise<void> | void;
};
