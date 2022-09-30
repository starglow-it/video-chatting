import React, { memo } from 'react';

import { CommonIconProps } from '../../types';

import { SvgIconWrapper } from '../SvgIconWrapper';

const RoundCloseIcon = memo(({ width, height, className, onClick, ...rest }: CommonIconProps) => (
    <SvgIconWrapper
        width={width}
        height={height}
        className={className}
        onClick={onClick}
        viewBox="0 0 26 26"
        fill="none"
        {...rest}
    >
        <circle cx="13" cy="13" r="13" fill="#BDC8D3" fillOpacity="0.25" />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.8206 8.17945C18.2436 8.60252 18.2436 9.28844 17.8206 9.71151L14.5321 13L17.8206 16.2885C18.2436 16.7116 18.2436 17.3975 17.8206 17.8206C17.3975 18.2436 16.7116 18.2436 16.2885 17.8206L13 14.5321L9.71151 17.8206C9.28844 18.2436 8.60251 18.2436 8.17944 17.8206C7.75637 17.3975 7.75637 16.7116 8.17944 16.2885L11.4679 13L8.17944 9.71151C7.75637 9.28844 7.75637 8.60252 8.17944 8.17945C8.60251 7.75638 9.28844 7.75638 9.7115 8.17945L13 11.4679L16.2885 8.17945C16.7116 7.75638 17.3975 7.75638 17.8206 8.17945Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { RoundCloseIcon };
