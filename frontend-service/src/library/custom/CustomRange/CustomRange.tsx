import { Slider, SliderProps, Stack } from '@mui/material';
import { memo } from 'react';
import { PropsWithClassName } from '../../../types';

const Component = ({
    Icon,
    className,
    value,
    onChange,
    defaultValue,
    color,
}: SliderProps & PropsWithClassName<{ Icon: any }>) => {
    return (
        <Stack spacing={2} direction="row" className={className} alignItems="center">
            {Icon}
            <Slider color={color} defaultValue={defaultValue} value={value} onChange={onChange} />
        </Stack>
    );
};

export const CustomRange = memo(Component);
