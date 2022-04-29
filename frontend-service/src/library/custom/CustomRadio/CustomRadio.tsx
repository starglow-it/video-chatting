import { Radio, RadioProps } from '@mui/material';
import { memo } from 'react';

const Component = (props: RadioProps) => {
    return <Radio {...props} />;
};

export const CustomRadio = memo(Component);
