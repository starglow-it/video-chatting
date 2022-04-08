import React, { forwardRef, memo } from 'react';

import { Grid, GridProps } from '@mui/material';

const Component = ({ children, ...rest }: GridProps, ref) => {
    return (
        <Grid ref={ref} {...rest}>
            {children}
        </Grid>
    );
};

const CustomGrid = memo<GridProps>(forwardRef<HTMLDivElement, GridProps>(Component));

export { CustomGrid };
