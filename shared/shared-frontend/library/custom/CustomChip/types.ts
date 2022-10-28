import React from 'react';

import { ChipProps } from '@mui/material/Chip/Chip';

type CustomChipProps = React.PropsWithoutRef<{
    active?: boolean;
}> & ChipProps

export type { CustomChipProps };
