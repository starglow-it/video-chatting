import React, { memo } from 'react';

import { CommonIconProps } from '../types';
import { SvgIconWrapper } from '../SvgIconWrapper';

const SmallCheckIcon = memo(
    ({ width, height, isActive, className, onClick }: CommonIconProps & { isActive: boolean }) => {
        if (!isActive) {
            return (
                <SvgIconWrapper
                    width={width}
                    height={height}
                    className={className}
                    onClick={onClick}
                    viewBox="0 0 15 15"
                    fill="none"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.72203 8.59682L10.0014 5.3175C10.26 5.05887 10.6793 5.05887 10.938 5.3175C11.1966 5.57613 11.1966 5.99546 10.938 6.25409L6.72238 10.4697L4.06212 7.81C3.80346 7.55139 3.80343 7.13204 4.06207 6.8734C4.32069 6.61478 4.73999 6.61478 4.99861 6.8734L6.72203 8.59682Z"
                        fill="#BDC8D3"
                    />
                </SvgIconWrapper>
            );
        }
        return (
            <SvgIconWrapper
                width={width}
                height={height}
                className={className}
                onClick={onClick}
                viewBox="0 0 15 15"
                fill="none"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.72203 8.59682L10.0014 5.3175C10.26 5.05887 10.6793 5.05887 10.938 5.3175C11.1966 5.57613 11.1966 5.99546 10.938 6.25409L6.72238 10.4697L4.06212 7.81C3.80346 7.55139 3.80343 7.13204 4.06207 6.8734C4.32069 6.61478 4.73999 6.61478 4.99861 6.8734L6.72203 8.59682Z"
                    fill="#69E071"
                />
            </SvgIconWrapper>
        );
    },
);

export { SmallCheckIcon };
