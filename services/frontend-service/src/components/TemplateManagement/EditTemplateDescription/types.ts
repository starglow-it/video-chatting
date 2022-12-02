import { ICommonTemplate, IUserTemplate } from 'shared-types';

export type EditTemplateDescriptionProps = {
    onNextStep: () => void;
    onPreviousStep: () => void;
    template: ICommonTemplate | IUserTemplate | null;
};
