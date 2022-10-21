import React, { memo } from 'react';
import { SvgIconWrapper } from '../SvgIconWrapper';
import { CommonIconProps } from '../types';

const TrashIcon = memo(({ width, height, ...rest }: CommonIconProps) => (
    <SvgIconWrapper width={width} height={height} viewBox="0 0 24 24" fill="none" {...rest}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.57565 9.79039C11.0971 9.55424 12.6439 9.53738 14.169 9.73979L14.5205 9.79039L16.0018 10.0203C16.5355 10.1032 16.9262 10.5588 16.9347 11.0908L16.9329 11.1754L16.5578 17.4269C16.4753 18.1548 15.7497 18.7197 14.859 18.7621L14.7513 18.7646H9.34485C8.44162 18.7646 7.68449 18.2277 7.55131 17.5134L7.53835 17.4269L7.16329 11.1754C7.13094 10.6362 7.49328 10.1577 8.0113 10.0364L8.09435 10.0203L9.57565 9.79039ZM12.0142 4.76465L12.1243 4.76911C12.4626 4.80702 12.7417 5.05222 12.8229 5.39176L12.8372 5.46592L12.844 5.56614L12.8428 6.90994L17.3928 7.5278C17.7373 7.57455 18.0056 7.83035 18.0757 8.16467L18.0876 8.23746L18.0936 8.3314L18.0865 8.43154C18.035 8.80204 17.7331 9.08326 17.3508 9.12003L17.2734 9.12408L17.172 9.11708L16.6635 9.05068C15.1422 8.86256 13.6124 8.59253 12.0824 8.59051C10.551 8.58849 9.01941 8.85465 7.49626 9.03911L6.89277 9.11708C6.44869 9.17733 6.03927 8.87041 5.9783 8.43154C5.92683 8.06105 6.14091 7.7098 6.49899 7.57258L6.57249 7.54805L6.67195 7.5278L11.2203 6.90994L11.2208 5.56608C11.2208 5.22241 11.4407 4.925 11.7663 4.81091L11.8377 4.78932L11.931 4.77068L12.0142 4.76465Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { TrashIcon };
