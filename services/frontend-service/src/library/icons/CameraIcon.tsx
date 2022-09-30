import React, { memo } from 'react';
import { CommonIconProps } from '@library/types';
import { SvgIconWrapper } from '@library/icons/SvgIconWrapper';

const CameraIcon = memo(({ isActive, width, height, className }: CommonIconProps) => {
    if (isActive) {
        return (
            <SvgIconWrapper
                width={width}
                height={height}
                className={className}
                viewBox="0 0 48 48"
                fill="none"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.3338 11.0021L24.6753 11L25.5908 11.0086C27.7142 11.0523 28.6507 11.2678 29.6124 11.7727C30.5158 12.2471 31.2136 12.932 31.6967 13.819C32.211 14.7631 32.4305 15.6825 32.4751 17.7671L32.4838 18.6659V29.3341L32.4751 30.2329L32.4449 31.0585C32.3618 32.5807 32.1375 33.3718 31.6967 34.181C31.2136 35.068 30.5158 35.7529 29.6124 36.2273C28.6507 36.7322 27.7142 36.9477 25.5908 36.9914L24.6753 37H13.8085L12.893 36.9914L12.0521 36.9618C10.5015 36.8802 9.6957 36.6601 8.87143 36.2273C7.96798 35.7529 7.27026 35.068 6.7871 34.181C6.20423 33.1111 6 32.0728 6 29.3341V18.6659L6.00876 17.7671C6.05329 15.6825 6.2728 14.7631 6.7871 13.819C7.27026 12.932 7.96798 12.2471 8.87143 11.7727C9.89719 11.2342 10.8943 11.0249 13.3338 11.0021ZM39.5789 17.2398C40.2417 16.9321 40.9999 17.416 40.9999 18.1468V29.8501C40.9999 30.5808 40.2417 31.0648 39.5789 30.7571L34.9579 28.612C34.6049 28.4481 34.379 28.0942 34.379 27.7049V20.2919C34.379 19.9027 34.6049 19.5488 34.9579 19.3849L39.5789 17.2398Z"
                    fill="currentColor"
                />
            </SvgIconWrapper>
        );
    }
    return (
        <SvgIconWrapper
            width={width}
            height={height}
            className={className}
            viewBox="0 0 48 48"
            fill="none"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.51377 41.6071C9.09955 42.1929 10.0493 42.1929 10.6351 41.6071L14.2462 37.996L14.2555 37.996L25.7444 37.996L26.7124 37.9868C28.9573 37.9397 29.9475 37.7076 30.9642 37.1639C31.9193 36.6531 32.657 35.9154 33.1678 34.9602C33.6339 34.0888 33.871 33.2368 33.9589 31.5975L33.9907 30.7084L34 29.7405L34 18.2516L33.9999 18.2423L39.608 12.6341C40.1938 12.0484 40.1938 11.0986 39.608 10.5128C39.0223 9.92704 38.0725 9.92704 37.4867 10.5128L8.51377 39.4858C7.92798 40.0716 7.92798 41.0213 8.51377 41.6071ZM32.1113 11.646L7.64996 36.1074C7.33281 35.7688 7.05993 35.3861 6.83215 34.9602C6.21591 33.808 5.99999 32.6898 5.99999 29.7405L5.99999 18.2516L6.00926 17.2836C6.05634 15.0387 6.28841 14.0486 6.83215 13.0319C7.34298 12.0767 8.08064 11.339 9.03581 10.8282C10.1203 10.2482 11.1745 10.0228 13.7537 9.99833L25.7445 9.99605L26.7124 10.0053C28.9573 10.0524 29.9475 10.2845 30.9642 10.8282C31.3901 11.056 31.7728 11.3289 32.1113 11.646ZM41.5762 16.6809C42.2396 16.3672 43.0037 16.8511 43.0037 17.5849L43.0037 30.4049C43.0037 31.1387 42.2396 31.6226 41.5762 31.3089L36.5762 28.9447C36.2267 28.7794 36.0037 28.4273 36.0037 28.0406L36.0037 19.9492C36.0037 19.5625 36.2267 19.2105 36.5762 19.0452L41.5762 16.6809Z"
                fill="currentColor"
            />
        </SvgIconWrapper>
    );
});

export { CameraIcon };
