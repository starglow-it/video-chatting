import React, { memo } from 'react';
import { CommonIconProps } from '../types';
import { SvgIconWrapper } from '../SvgIconWrapper';

const UploadRoundIcon = memo(({ width, height, ...rest }: CommonIconProps) => (
    <SvgIconWrapper width={width} height={height} viewBox="0 0 48 48" fill="none" {...rest}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14 24.5425C14 24.0892 14.1446 23.6473 14.4134 23.2794L22.2193 12.5933C22.9272 11.6241 24.2983 11.4041 25.2817 12.1017C25.4738 12.238 25.6423 12.404 25.7806 12.5933L33.5865 23.2794C34.2944 24.2485 34.071 25.5997 33.0876 26.2973C32.7143 26.5621 32.2659 26.7047 31.8058 26.7047L28.3247 26.705L28.3254 34.7027C28.3254 35.4192 27.736 36 27.009 36H20.9908C20.2638 36 19.6744 35.4192 19.6744 34.7027L19.6737 26.705L16.194 26.7047C14.9823 26.7047 14 25.7366 14 24.5425Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { UploadRoundIcon };
