import React, { memo } from 'react';

import { SliderArrowProps } from '../types';
import { SvgIconWrapper } from './SvgIconWrapper';

const NextSliderArrow = memo(({ customClassName, onClick }: SliderArrowProps) => {
    return (
        <SvgIconWrapper
            className={customClassName}
            onClick={onClick}
            width="34px"
            height="34px"
            viewBox="0 0 34 34"
            fill="none"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.7535 16.4924L13.4453 11.1843C12.8591 10.5981 12.8591 9.64759 13.4453 9.06135C14.0316 8.47512 14.9821 8.47512 15.5683 9.06135L22.9986 16.4917L15.5534 23.9383C14.9672 24.5246 14.0167 24.5246 13.4304 23.9384C12.8442 23.3522 12.8442 22.4017 13.4304 21.8155L18.7535 16.4924Z"
                fill="#0F0F10"
            />
        </SvgIconWrapper>
    );
});

export { NextSliderArrow };
