import React, { ForwardedRef, forwardRef, memo } from 'react';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// types
import { GridProps } from '@mui/material';

// styles
import styles from './TagWrapper.module.scss';

const Component = (
    { children, className, ...rest }: React.PropsWithChildren<GridProps>,
    ref: ForwardedRef<HTMLDivElement>,
) => (
    <CustomGrid
        ref={ref}
        item
        alignItems="center"
        className={clsx(styles.tagWrapper, className)}
        {...rest}
    >
        {children}
    </CustomGrid>
);

export const TagWrapper = memo(forwardRef(Component));
