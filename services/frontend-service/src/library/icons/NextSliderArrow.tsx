import React, { useEffect, useState, memo } from 'react';

import { RoundArrowIcon } from '@library/icons/RoundIcons/RoundArrowIcon';

import { SliderArrowProps } from '../types';

const Component = memo(({ customClassName, onClick, dotsRef }: SliderArrowProps) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        setValue(prev => prev + 1);
    }, []);

    const rect = dotsRef?.current?.getBoundingClientRect?.();

    if (!rect?.width) return null;

    const style = {
        '--offset': `${(rect?.width ?? 0) / 2 + 20}px`,
    } as React.CSSProperties;

    return (
        <RoundArrowIcon
            key={value}
            onClick={onClick}
            style={style}
            width="34px"
            height="34px"
            className={customClassName}
        />
    );
});

export const NextSliderArrow = memo(Component);
