import React, {forwardRef, memo} from 'react';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// types
import { GridProps } from '@mui/material';

// styles
import styles from './TagWrapper.module.scss';

const TagWrapper = memo(forwardRef(({ children, className, ...rest }: React.PropsWithChildren<GridProps & {}>, ref) => {
    return (
        <CustomGrid
            ref={ref}
            item
            alignItems="center"
            className={clsx(styles.tagWrapper, className)}
            {...rest}
        >
            {children}
        </CustomGrid>
    )
}));

export { TagWrapper };
