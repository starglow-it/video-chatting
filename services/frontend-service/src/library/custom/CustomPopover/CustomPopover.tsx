import { memo } from 'react';

import { Popover, PopoverProps } from '@mui/material';

const CustomPopover = memo(({ children, ...rest }: PopoverProps) => (
    <Popover {...rest}>{children}</Popover>
));

export { CustomPopover };
