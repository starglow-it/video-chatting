import { forwardRef, memo } from 'react';
import { Box, BoxProps } from '@mui/material';

const CustomBox = memo(
    forwardRef(({ children, ...rest }: BoxProps, ref) => (
        <Box ref={ref} {...rest}>
            {children}
        </Box>
    )),
);

export { CustomBox };
