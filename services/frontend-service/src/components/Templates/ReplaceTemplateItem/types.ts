import { IUserTemplate } from 'shared-types';

export type ReplaceTemplateItemProps = {
    template: IUserTemplate;
    onChooseTemplate?: (
        templateId: IUserTemplate['id'],
    ) => Promise<void> | void;
};
