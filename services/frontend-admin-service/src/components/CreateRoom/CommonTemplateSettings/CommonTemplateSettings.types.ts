import { IBusinessCategory } from 'shared-types';

export type CommonTemplateSettingsProps = {
    onNextStep: () => void;
    onPreviousStep: () => void;
    categories: IBusinessCategory[];
};
