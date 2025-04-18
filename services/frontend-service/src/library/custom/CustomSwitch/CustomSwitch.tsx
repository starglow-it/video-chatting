import { memo } from 'react';
import Switch, { SwitchProps } from '@mui/material/Switch';

import { CustomSwitchProps } from './types';

const CustomSwitch = memo(
    ({
        name,
        className,
        checked,
        onChange,
        inputRef,
        ...props
    }: CustomSwitchProps & SwitchProps) => (
        <Switch
            name={name}
            disableRipple
            className={className}
            checked={checked}
            onChange={onChange}
            inputRef={inputRef}
            {...props}
        />
    ),
);

export { CustomSwitch };
