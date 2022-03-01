import React, { memo, useState } from 'react';
import Switch from '@mui/material/Switch';

import { CustomSwitchProps } from './types';

const CustomSwitch = memo(({ className }: CustomSwitchProps) => {
    const [checked, setChecked] = useState(false);
    const handleChange = () => setChecked(prev => !prev);

    return <Switch disableRipple className={className} value={checked} onChange={handleChange} />;
});

export { CustomSwitch };
