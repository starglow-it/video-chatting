import React, { ForwardedRef, forwardRef, memo } from 'react';

import { Grid, GridProps } from '@mui/material';

const Component = ({ children, ...rest }: GridProps, ref: ForwardedRef<HTMLDivElement>) => (
        <Grid ref={ref} {...rest}>
            {children}
        </Grid>
    );

export const CustomGrid = memo<GridProps>(forwardRef<HTMLDivElement, GridProps>(Component));
