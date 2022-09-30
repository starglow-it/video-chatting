import React, { ForwardedRef, forwardRef, memo } from 'react';
import clsx from 'clsx';
import { Typography } from '@mui/material';

// common
import { Translation } from '@library/common/Translation/Translation';

// types
import { CustomTypographyProps } from './types';

// styles
import styles from './CustomTypography.module.scss';

const Component = (
    {
        transform,
        nameSpace,
        translation,
        children,
        className,
        options,
        ...rest
    }: CustomTypographyProps,
    ref: ForwardedRef<HTMLSpanElement>,
) => (
    <Typography
        component="span"
        ref={ref}
        {...rest}
        className={clsx(className, transform && styles[transform])}
    >
        {nameSpace && translation ? (
            <Translation nameSpace={nameSpace} translation={translation} options={options} />
        ) : (
            children
        )}
    </Typography>
);

export const CustomTypography = memo<CustomTypographyProps>(
    forwardRef<HTMLSpanElement, CustomTypographyProps>(Component),
);
