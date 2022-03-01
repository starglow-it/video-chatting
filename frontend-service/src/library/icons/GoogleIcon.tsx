import React, { memo } from 'react';

import { CommonIconProps } from '../types';
import { SvgIconWrapper } from './SvgIconWrapper';

const GoogleIcon = memo(({ width, height, className, onClick }: CommonIconProps) => {
    return (
        <SvgIconWrapper
            width={width}
            height={height}
            className={className}
            onClick={onClick}
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                d="M6.6875 12.0001C6.6875 11.0092 6.96051 10.081 7.4348 9.2862V5.91479H4.0634C2.72531 7.65261 2 9.77054 2 12.0001C2 14.2298 2.72531 16.3477 4.0634 18.0855H7.4348V14.7141C6.96051 13.9193 6.6875 12.991 6.6875 12.0001Z"
                fill="#FBBD00"
            />
            <path
                d="M12 17.3124L9.65625 19.6561L12 21.9999C14.2296 21.9999 16.3475 21.2746 18.0854 19.9365V16.5687H14.7175C13.9158 17.0447 12.9836 17.3124 12 17.3124Z"
                fill="#0F9D58"
            />
            <path
                d="M7.43488 14.714L4.06348 18.0854C4.3284 18.4295 4.61688 18.759 4.92902 19.0712C6.81777 20.9599 9.32899 22.0001 12.0001 22.0001V17.3126C10.0616 17.3126 8.3627 16.2688 7.43488 14.714Z"
                fill="#31AA52"
            />
            <path
                d="M22 12C22 11.3916 21.9449 10.782 21.8363 10.1884L21.7483 9.70792H12V14.3954H16.7442C16.2835 15.3119 15.5752 16.0596 14.7175 16.5688L18.0853 19.9366C18.4294 19.6717 18.7589 19.3832 19.0711 19.0711C20.9598 17.1823 22 14.671 22 12Z"
                fill="#3C79E6"
            />
            <path
                d="M15.7565 8.24348L16.1708 8.65777L19.4854 5.34324L19.0711 4.92895C17.1823 3.0402 14.6711 2 12 2L9.65625 4.34375L12 6.6875C13.419 6.6875 14.7531 7.24008 15.7565 8.24348Z"
                fill="#CF2D48"
            />
            <path
                d="M11.9991 6.6875V2C9.32805 2 6.81684 3.0402 4.92805 4.92891C4.6159 5.24105 4.32742 5.57055 4.0625 5.91465L7.43391 9.28605C8.36176 7.73125 10.0607 6.6875 11.9991 6.6875Z"
                fill="#EB4132"
            />
        </SvgIconWrapper>
    );
});

export { GoogleIcon };
