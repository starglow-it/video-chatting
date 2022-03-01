import React, { memo } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { CustomSliderProps } from './types';

const DEFAULT_SETTINGS = {
    dots: true,
    speed: 500,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
};

const CustomSlider = memo(({ children, sliderSettings }: CustomSliderProps) => {
    const commonSettings = { ...DEFAULT_SETTINGS, ...sliderSettings };

    return (
        <Slider {...commonSettings}>
            {React.Children.map(children, child => {
                return <div>{child}</div>;
            })}
        </Slider>
    );
});

export { CustomSlider };
