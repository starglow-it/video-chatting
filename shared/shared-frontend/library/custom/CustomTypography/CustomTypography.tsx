import React, { ForwardedRef, forwardRef, memo } from 'react';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';

// types
import { CustomTypographyProps } from './CustomTypography.types';

// styles
import styles from './CustomTypography.module.scss';

const Component = (
    {
        transform,
        children,
        className,
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
        {children}
    </Typography>
);

const CustomTypography = memo<CustomTypographyProps>(
    forwardRef<HTMLSpanElement, CustomTypographyProps>(Component),
);

export default CustomTypography;
