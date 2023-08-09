import React, { ForwardedRef, forwardRef, memo } from 'react';
import clsx from 'clsx';
import { GridProps } from '@mui/material/Grid';

// custom
import {CustomGrid} from "../../custom/CustomGrid";

// styles
import styles from './TagWrapper.module.scss';

const Component = (
    { children, className, ...rest }: React.PropsWithChildren<GridProps>,
    ref: ForwardedRef<HTMLDivElement | null>,
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

const TagWrapper = memo(forwardRef(Component));

export default TagWrapper;
