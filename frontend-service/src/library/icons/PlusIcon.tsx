import React, { memo } from 'react';
import { CommonIconProps } from '@library/types';
import { SvgIconWrapper } from './SvgIconWrapper';

const PlusIcon = memo(({ width, height, className, ...rest }: CommonIconProps) => (
    <SvgIconWrapper
        width={width}
        height={height}
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        {...rest}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 5C12.5523 5 13 5.44772 13 6V11H18C18.5523 11 19 11.4477 19 12C19 12.5523 18.5523 13 18 13H13V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V13H6C5.44772 13 5 12.5523 5 12C5 11.4477 5.44772 11 6 11H11V6C11 5.44772 11.4477 5 12 5Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { PlusIcon };
