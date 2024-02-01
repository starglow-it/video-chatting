/* eslint-disable react/require-default-props */
import { ForwardedRef, forwardRef, memo, PropsWithChildren } from 'react';

import { Paper, PaperProps } from '@mui/material';

const Component = (
    {
        children,
        borderRadius,
        ...rest
    }: PropsWithChildren<{ borderRadius?: number | string } & PaperProps>,
    ref: ForwardedRef<HTMLDivElement>,
) => (
    <Paper ref={ref} {...rest}>
        {children}
    </Paper>
);

export const CustomPaper = memo(forwardRef(Component));
