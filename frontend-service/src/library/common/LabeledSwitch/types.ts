import { TranslationProps } from '@library/common/Translation/types';
import React from 'react';
import { PropsWithClassName } from '../../../types';

export type LabeledSwitchProps = TranslationProps &
    PropsWithClassName<{
        Icon: React.ElementType;
        checked: boolean;
        onChange: () => void;
    }>;
