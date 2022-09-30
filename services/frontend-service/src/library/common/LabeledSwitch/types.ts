import { TranslationProps } from '@library/common/Translation/types';
import { PropsWithClassName } from '../../../types';

export type LabeledSwitchProps = TranslationProps &
    PropsWithClassName<{
        Icon: JSX.Element;
        SwitchComponent?: JSX.Element;
        checked?: boolean;
        onChange?: () => void;
    }>;
