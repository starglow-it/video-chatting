import { ForwardedRef, forwardRef, memo, PropsWithChildren } from 'react';

import Paper, { PaperProps } from '@mui/material/Paper';

const Component = (
    { children, borderRadius, ...rest }: PropsWithChildren<PaperProps>,
    ref: ForwardedRef<HTMLDivElement>,
) => (
    <Paper ref={ref} {...rest}>
        {children}
    </Paper>
);

const CustomPaper = memo(forwardRef(Component));

export default CustomPaper;
