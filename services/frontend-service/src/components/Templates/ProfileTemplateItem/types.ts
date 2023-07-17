import { IUserTemplate } from 'shared-types';

export type ProfileTemplateProps = {
    template: IUserTemplate;
    onChooseTemplate?: (templateId: IUserTemplate['id']) => void;
};
