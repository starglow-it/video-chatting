import React, { memo } from 'react';

import { SvgIconWrapper } from '../SvgIconWrapper';

import { CommonIconProps } from '@library/types';

const RoundArrowIcon = memo(({ className, width, height, ...rest }: CommonIconProps) => {
    return (
        <SvgIconWrapper
            className={className}
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            {...rest}
        >
            <circle cx="12" cy="12" r="12" fill="#BDC8D3" fillOpacity="0.25" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.0053 13.5035L15.7522 9.75653C16.166 9.34272 16.8369 9.34272 17.2507 9.75653V9.75653C17.6645 10.1703 17.6645 10.8413 17.2507 11.2551L12.0058 16.5L6.74938 11.2445C6.33552 10.8308 6.33549 10.1598 6.74931 9.74599V9.74599C7.1631 9.33219 7.83399 9.33219 8.24779 9.74599L12.0053 13.5035Z"
                fill="#0F0F10"
            />
        </SvgIconWrapper>
    );
});

export { RoundArrowIcon };
