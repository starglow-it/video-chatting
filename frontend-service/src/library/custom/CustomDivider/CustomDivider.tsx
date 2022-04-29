import React, { memo } from 'react';
import { Divider, DividerProps } from '@mui/material';

const Component = ({ className }: DividerProps) => {
    return <Divider className={className || ''} light />;
};

const CustomDivider = memo(Component);

export { CustomDivider };
