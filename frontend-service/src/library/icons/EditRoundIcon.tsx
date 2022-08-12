import React, { memo } from 'react';
import { SvgIconWrapper } from '@library/icons/SvgIconWrapper';
import { CommonIconProps } from '@library/types';

const EditRoundIcon = memo(({ width, height, ...rest }: CommonIconProps) => (
    <SvgIconWrapper width={width} height={height} viewBox="0 0 48 48" fill="none" {...rest}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M33.7691 12.7372L35.2391 14.2087C35.7298 14.7 36.0001 15.3536 36.0001 16.0488C36.0001 16.7439 35.7298 17.3975 35.2391 17.8886L33.4385 19.6911L28.2925 14.5397L30.0931 12.7372C31.0744 11.7547 32.7867 11.7538 33.7691 12.7372ZM13.6162 29.2313L26.8213 16.0113L31.9675 21.1629L18.7612 34.3819C18.6947 34.4484 18.6115 34.4962 18.52 34.5191L12.6451 35.9845C12.6036 35.9949 12.561 36.0001 12.5193 36.0001C12.3832 36.0001 12.2501 35.946 12.1525 35.8482C12.0234 35.719 11.9715 35.5307 12.0152 35.3537L13.4789 29.4727C13.5018 29.3822 13.5497 29.298 13.6162 29.2313Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { EditRoundIcon };
