import React, { ForwardedRef, forwardRef, memo } from 'react';
import clsx from 'clsx';

import { Chip } from '@mui/material';

// custom
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// types
import { CustomChipProps } from './types';

// styles
import styles from './CustomChip.module.scss';

const Component: React.FunctionComponent<CustomChipProps> = (
    { active = false, className, nameSpace, translation, ...rest },
    ref: ForwardedRef<HTMLInputElement>,
) => (
    <Chip
        ref={ref}
        className={clsx(className, {
            [styles.active]: active,
        })}
        label={<CustomTypography nameSpace={nameSpace} translation={translation} />}
        {...rest}
    />
);

export const CustomChip = memo(forwardRef(Component));
