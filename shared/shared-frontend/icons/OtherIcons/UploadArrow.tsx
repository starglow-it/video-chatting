import React, { memo } from 'react';

import { CommonIconProps } from '../types';
import { SvgIconWrapper } from '../SvgIconWrapper';

const UploadArrowIcon = memo(({ width, height, ...rest }: CommonIconProps) => (
    <SvgIconWrapper width={width} height={height} viewBox="0 0 40 40" fill="none" {...rest}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.9812 20.4414C9.9812 19.9797 10.1285 19.5296 10.4022 19.1549L18.3527 8.2709C19.0737 7.28383 20.4702 7.05967 21.4718 7.77022C21.6675 7.90901 21.8391 8.07809 21.9799 8.2709L29.9304 19.1549C30.6514 20.1419 30.4239 21.5181 29.4223 22.2287C29.042 22.4985 28.5853 22.6436 28.1168 22.6436L24.5712 22.644L24.5719 30.7898C24.5719 31.5195 23.9716 32.1111 23.2311 32.1111H17.1015C16.361 32.1111 15.7607 31.5195 15.7607 30.7898L15.76 22.644L12.2158 22.6436C10.9817 22.6436 9.9812 21.6577 9.9812 20.4414Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { UploadArrowIcon };
