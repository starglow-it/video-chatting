import React, { memo } from 'react';

import { CommonIconProps } from '../types';

import { SvgIconWrapper } from './SvgIconWrapper';

const EditIcon = memo(({ width, height, className, onClick }: CommonIconProps) => (
    <SvgIconWrapper
        width={width}
        height={height}
        className={className}
        onClick={onClick}
        viewBox="0 0 24 24"
        fill="none"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.5127 4.4915L19.4927 5.47249C19.8199 5.8 20.0001 6.23574 20.0001 6.69918C20.0001 7.16261 19.8199 7.59836 19.4927 7.92573L18.2923 9.12739L14.8617 5.69316L16.0621 4.4915C16.7163 3.83649 17.8578 3.83585 18.5127 4.4915ZM5.07741 15.4875L13.8808 6.67423L17.3116 10.1086L8.50741 18.9213C8.46312 18.9656 8.40766 18.9975 8.34662 19.0127L4.43006 19.9897C4.4024 19.9967 4.37397 20.0001 4.34618 20.0001C4.25544 20.0001 4.16673 19.964 4.10163 19.8988C4.01559 19.8127 3.98094 19.6872 4.01013 19.5692L4.98591 15.6485C5.00114 15.5882 5.03312 15.532 5.07741 15.4875Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { EditIcon };
