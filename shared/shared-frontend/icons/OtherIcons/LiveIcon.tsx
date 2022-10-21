import React, { memo } from 'react';

import { CommonIconProps } from '../types';
import { SvgIconWrapper } from '../SvgIconWrapper';

const LiveIcon = memo(({ width, height, className, onClick }: CommonIconProps) => (
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
            d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12ZM19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12ZM6.55556 12C6.55556 8.99312 8.99312 6.55556 12 6.55556C15.0069 6.55556 17.4444 8.99312 17.4444 12C17.4444 15.0069 15.0069 17.4444 12 17.4444C8.99312 17.4444 6.55556 15.0069 6.55556 12ZM15.4444 12C15.4444 10.0977 13.9023 8.55556 12 8.55556C10.0977 8.55556 8.55556 10.0977 8.55556 12C8.55556 13.9023 10.0977 15.4444 12 15.4444C13.9023 15.4444 15.4444 13.9023 15.4444 12ZM12 13.7778C12.9818 13.7778 13.7778 12.9818 13.7778 12C13.7778 11.0182 12.9818 10.2222 12 10.2222C11.0182 10.2222 10.2222 11.0182 10.2222 12C10.2222 12.9818 11.0182 13.7778 12 13.7778Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { LiveIcon };
