import React, { ForwardedRef, forwardRef, memo, PropsWithChildren } from 'react';

import { Grid, GridProps } from '@mui/material';

type CustomGripProps = Omit<GridProps, 'children'> & PropsWithChildren;

const Component = ({ children, ...rest }: CustomGripProps, ref: ForwardedRef<HTMLDivElement>) => (
    <Grid ref={ref} {...rest}>
        {children}
    </Grid>
);

const CustomGrid = memo<CustomGripProps>(
    forwardRef<HTMLDivElement, CustomGripProps>(Component),
);

export default CustomGrid
