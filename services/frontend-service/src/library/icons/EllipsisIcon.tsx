import React, { memo } from 'react';
import { SvgIconWrapper } from '@library/icons/SvgIconWrapper';
import { CommonIconProps } from '@library/types';

const EllipsisIcon = memo(({ width, height, ...rest }: CommonIconProps) => (
    <SvgIconWrapper width={width} height={height} viewBox="0 0 20 20" fill="none" {...rest}>
        <path
            d="M9.99992 8.68909C9.27891 8.68909 8.689 9.279 8.689 10C8.689 10.721 9.27891 11.3109 9.99992 11.3109C10.7209 11.3109 11.3108 10.721 11.3108 10C11.3108 9.279 10.7209 8.68909 9.99992 8.68909ZM13.9327 8.68909C13.2117 8.68909 12.6218 9.279 12.6218 10C12.6218 10.721 13.2117 11.3109 13.9327 11.3109C14.6537 11.3109 15.2436 10.721 15.2436 10C15.2436 9.279 14.6537 8.68909 13.9327 8.68909ZM6.06715 8.68909C5.34614 8.68909 4.75623 9.279 4.75623 10C4.75623 10.721 5.34614 11.3109 6.06715 11.3109C6.78816 11.3109 7.37807 10.721 7.37807 10C7.37807 9.279 6.78816 8.68909 6.06715 8.68909Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { EllipsisIcon };
