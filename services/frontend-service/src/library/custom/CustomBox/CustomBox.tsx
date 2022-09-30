import { ForwardedRef, forwardRef, memo } from 'react';
import { Box, BoxProps } from '@mui/material';

const Component = ({ children, ...rest }: BoxProps, ref: ForwardedRef<HTMLDivElement>) => (
    <Box ref={ref} {...rest}>
        {children}
    </Box>
);

export const CustomBox = memo(forwardRef(Component));
