import React, { ForwardedRef, forwardRef, memo } from 'react';

import Grid, { GridProps } from '@mui/material/Grid';

const Component = ({ children, ...rest }: GridProps, ref: ForwardedRef<HTMLDivElement>) => (
    <Grid ref={ref} {...rest}>
        {children}
    </Grid>
);

const CustomGrid = memo<GridProps>(
    forwardRef<HTMLDivElement, GridProps>(Component),
);

export default CustomGrid;
