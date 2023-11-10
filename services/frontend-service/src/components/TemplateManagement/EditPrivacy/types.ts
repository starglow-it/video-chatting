import { ICommonTemplate, IUserTemplate } from 'shared-types';

export type EditPrivacyProps = {
    onPreviousStep: () => void;
    onUpgradePlan: () => void;
    onSubmit: () => void;
    template: ICommonTemplate | IUserTemplate | null;
};
