import React, { memo } from 'react';
import Divider, { DividerProps } from '@mui/material/Divider';

const Component = ({ className }: DividerProps) => <Divider className={className || ''} light />;

const CustomDivider = memo(Component);

export default CustomDivider;
