import React, { forwardRef, memo } from 'react';
import clsx from 'clsx';
import { Typography } from '@mui/material';

import { Translation } from '@library/common/Translation/Translation';

import { CustomTypographyProps } from './types';

import styles from './CustomTypography.module.scss';

const CustomTypography = memo(
    forwardRef(
        (
            {
                transform,
                nameSpace,
                translation,
                children,
                className,
                options,
                ...rest
            }: CustomTypographyProps,
            ref,
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
        ),
    ),
);

export { CustomTypography };
