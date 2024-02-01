import { ICommonTemplate, IUserTemplate } from 'shared-types';

export type EditPrivacyProps = {
    onPreviousStep: () => void;
    onUpgradePlan: () => void;
    onSubmit: () => void;
    handleEnterMeeting: () => void;
    handleScheduleMeeting: () => void;
    template: ICommonTemplate | IUserTemplate | null;
};
