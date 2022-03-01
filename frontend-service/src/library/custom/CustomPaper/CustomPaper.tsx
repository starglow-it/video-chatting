import { ForwardedRef, forwardRef, memo } from 'react';

import { Paper, PaperProps } from '@mui/material';

const CustomPaper = memo(
    forwardRef(({ children, ...rest }: PaperProps, ref: ForwardedRef<HTMLDivElement>) => {
        return (
            <Paper ref={ref} {...rest}>
                {children}
            </Paper>
        );
    }),
);

export { CustomPaper };
