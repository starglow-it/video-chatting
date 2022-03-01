import React, { memo } from 'react';
import { SvgIconWrapper } from './SvgIconWrapper';
import { CommonIconProps } from '@library/types';

const PlusAddIcon = memo(({ width, height, ...rest }: CommonIconProps) => {
    return (
        <SvgIconWrapper width={width} height={height} viewBox="0 0 28 29" fill="none" {...rest}>
            <circle cx="14" cy="14.2864" r="14" fill="#FF884E" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14 6.94482C14.6444 6.94482 15.1667 7.46716 15.1667 8.11149L15.1667 13.1199H20.1751C20.8194 13.1199 21.3418 13.6422 21.3418 14.2865C21.3418 14.9309 20.8194 15.4532 20.1751 15.4532H15.1667L15.1667 20.4616C15.1667 21.1059 14.6444 21.6282 14.0001 21.6282C13.3557 21.6282 12.8334 21.1059 12.8334 20.4616L12.8334 15.4532H7.82501C7.18068 15.4532 6.65834 14.9309 6.65834 14.2865C6.65834 13.6422 7.18068 13.1199 7.82501 13.1199H12.8334L12.8334 8.11149C12.8334 7.46716 13.3557 6.94482 14 6.94482Z"
                fill="white"
            />
        </SvgIconWrapper>
    );
});

export { PlusAddIcon };
