import React, { forwardRef, memo } from 'react';
import { Grid, GridProps } from '@mui/material';

const CustomGrid = memo(
    forwardRef(({ children, ...rest }: GridProps, ref) => {
        return (
            <Grid ref={ref} {...rest}>
                {children}
            </Grid>
        );
    }),
);

export { CustomGrid };
