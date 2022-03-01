import { forwardRef, memo } from 'react';
import { Box, BoxProps } from '@mui/material';

const CustomBox = memo(
    forwardRef(({ children, ...rest }: BoxProps, ref) => {
        return (
            <Box ref={ref} {...rest}>
                {children}
            </Box>
        );
    }),
);

export { CustomBox };
