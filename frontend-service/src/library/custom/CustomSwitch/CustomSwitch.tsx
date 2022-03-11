import React, { memo } from 'react';
import Switch from '@mui/material/Switch';

import { CustomSwitchProps } from './types';

const CustomSwitch = memo(({ className, checked, onChange }: CustomSwitchProps) => {
    return <Switch disableRipple className={className} checked={checked} onChange={onChange} />;
});

export { CustomSwitch };
