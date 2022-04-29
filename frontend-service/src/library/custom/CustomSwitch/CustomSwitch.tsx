import React, { memo } from 'react';
import Switch, { SwitchProps } from '@mui/material/Switch';

import { CustomSwitchProps } from './types';

const CustomSwitch = memo(({ className, checked, onChange }: CustomSwitchProps & SwitchProps) => {
    return <Switch disableRipple className={className} checked={checked} onChange={onChange} />;
});

export { CustomSwitch };
