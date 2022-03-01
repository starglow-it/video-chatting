import React, { memo } from 'react';
import { SvgIconWrapper } from './SvgIconWrapper';
import { SliderArrowProps } from '@library/types';

const PrevSliderArrow = memo(({ customClassName, onClick }: SliderArrowProps) => {
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
                d="M14.2449 16.5074L19.5531 21.8156C20.1393 22.4018 20.1393 23.3523 19.5531 23.9385C18.9668 24.5248 18.0164 24.5248 17.4301 23.9385L9.99982 16.5082L17.4451 9.06162C18.0313 8.47532 18.9818 8.47527 19.568 9.06152C20.1542 9.64773 20.1542 10.5982 19.568 11.1844L14.2449 16.5074Z"
                fill="#0F0F10"
            />
        </SvgIconWrapper>
    );
});

export { PrevSliderArrow };
