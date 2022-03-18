import React, {ForwardedRef, forwardRef, memo} from 'react';
import { Grid, GridProps } from '@mui/material';

const CustomGrid = memo(
    forwardRef(({ children, ...rest }: GridProps, ref: ForwardedRef<HTMLDivElement>) => {
        return (
            <Grid ref={ref} {...rest}>
                {children}
            </Grid>
        );
    }),
);

export { CustomGrid };
