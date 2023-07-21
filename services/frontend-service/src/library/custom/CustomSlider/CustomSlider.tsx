import React, { memo } from 'react';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { CustomSliderProps } from './types';

const DEFAULT_SETTINGS: Settings = {
    dots: true,
    speed: 500,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
};

const CustomSlider = memo(({ children, sliderSettings }: CustomSliderProps) => {
    const commonSettings = {
        ...DEFAULT_SETTINGS,
        ...sliderSettings,
    } as Settings;

    return (
        <Slider
            dots={commonSettings.dots}
            speed={commonSettings.speed}
            infinite={commonSettings.infinite}
            slidesToShow={commonSettings.slidesToShow}
            slidesToScroll={commonSettings.slidesToScroll}
            dotsClass={commonSettings.dotsClass}
            afterChange={commonSettings.afterChange}
            beforeChange={commonSettings.beforeChange}
            appendDots={commonSettings.appendDots}
            customPaging={commonSettings.customPaging}
            nextArrow={commonSettings.nextArrow}
            prevArrow={commonSettings.prevArrow}
        >
            {React.Children.map(children, child => (
                <div>{child}</div>
            ))}
        </Slider>
    );
});

export { CustomSlider };
