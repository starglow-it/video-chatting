import React from 'react';

import { TranslationProps } from '@library/common/Translation/types';
import { ChipProps } from '@mui/material/Chip/Chip';

type CustomChipProps = React.PropsWithoutRef<{
    active?: boolean;
}> &
    Omit<ChipProps, 'label'> &
    TranslationProps;

export type { CustomChipProps };
