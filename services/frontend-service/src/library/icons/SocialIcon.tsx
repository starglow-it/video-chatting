import React, { memo } from 'react';
import { CommonIconProps } from '@library/types';
import { SvgIconWrapper } from './SvgIconWrapper';

const SocialIcon = memo(({ width, height, ...rest }: CommonIconProps) => (
    <SvgIconWrapper width={width} height={height} viewBox="0 0 24 24" fill="none" {...rest}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.6704 5.00057C16.2036 5.0109 17.0737 5.07289 17.7506 5.44482C18.2827 5.73721 18.7245 6.15776 19.0317 6.66419C19.3827 7.24289 19.471 7.96992 19.4932 9.16954L19.5 9.8963V12.1797C19.4949 13.8283 19.4485 14.7246 19.0317 15.4118C18.7245 15.9183 18.2827 16.3389 17.7506 16.6312C17.1045 16.9862 16.2826 17.0588 14.8761 17.0737L14.3547 17.0769L9.58352 17.0775L6.77963 18.8677C6.6445 18.954 6.48583 19 6.32353 19C5.86871 19 5.5 18.6461 5.5 18.2096L5.50158 10.6353C5.51365 8.16595 5.61829 6.8374 6.5252 5.97424C7.36732 5.17274 8.63102 5.02962 10.8845 5.00406L11.4224 5L14.6704 5.00057ZM15.3 12H9.7C9.3134 12 9 12.3134 9 12.7C9 13.0866 9.3134 13.4 9.7 13.4H15.3C15.6866 13.4 16 13.0866 16 12.7C16 12.3134 15.6866 12 15.3 12ZM15.3 9.2H9.7C9.3134 9.2 9 9.5134 9 9.9C9 10.2866 9.3134 10.6 9.7 10.6H15.3C15.6866 10.6 16 10.2866 16 9.9C16 9.5134 15.6866 9.2 15.3 9.2Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { SocialIcon };
