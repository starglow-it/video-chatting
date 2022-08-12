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
    orientation,
}: SliderProps & PropsWithClassName<{ Icon?: any }>) => (
    <Stack spacing={2} direction="row" className={className} alignItems="center">
        {Icon}
        <Slider
            sx={
                orientation === 'vertical'
                    ? {
                          '& input[type="range"]': {
                              WebkitAppearance: 'slider-vertical',
                          },
                      }
                    : {
                          height: '8px',
                      }
            }
            color={color}
            defaultValue={defaultValue}
            value={value}
            onChange={onChange}
            orientation={orientation}
        />
    </Stack>
);

export const CustomRange = memo(Component);
