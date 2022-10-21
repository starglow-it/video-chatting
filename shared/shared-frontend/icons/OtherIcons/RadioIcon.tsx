import React, { memo } from 'react';

import { CommonIconProps } from '../types';

import { SvgIconWrapper } from '../SvgIconWrapper';

const Component = ({
    width,
    height,
    className,
    onClick,
    checked,
}: CommonIconProps & { checked?: boolean }) => {
    if (checked) {
        return (
            <SvgIconWrapper
                classes={{ root: className }}
                onClick={onClick}
                width={width}
                height={height}
                viewBox="0 0 24 24"
                fill="none"
            >
                <rect
                    width="20"
                    height="20"
                    rx="12"
                    stroke="currentColor"
                    strokeWidth="4"
                    y="2"
                    x="2"
                />
            </SvgIconWrapper>
        );
    }

    return (
        <SvgIconWrapper
            classes={{ root: className }}
            onClick={onClick}
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
        >
            <rect
                width="22"
                height="22"
                rx="12"
                stroke="currentColor"
                strokeWidth="1"
                y="1"
                x="1"
            />
        </SvgIconWrapper>
    );
};

export const RadioIcon = memo(Component);
