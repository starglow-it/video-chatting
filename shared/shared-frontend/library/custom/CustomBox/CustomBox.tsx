import { ForwardedRef, forwardRef, memo } from 'react';
import { Box, BoxProps } from '@mui/material';

const Component = ({ children, ...rest }: BoxProps, ref: ForwardedRef<HTMLDivElement>) => (
    <Box ref={ref} {...rest}>
        {children}
    </Box>
);

const CustomBox = memo(forwardRef(Component));

export default CustomBox;