import React, { memo } from 'react';
import { CommonIconProps } from '../types';
import { SvgIconWrapper } from '../SvgIconWrapper';

const PersonIcon = memo(({ width, height, className, onClick }: CommonIconProps) => (
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
            d="M11.8785 13.3334C15.8806 13.3334 17.7842 14.6509 18.6876 16.5649C18.7386 16.673 18.7909 16.8136 18.8446 16.9866L18.9537 17.3761C19.155 18.1621 18.6814 18.9625 17.8958 19.164C17.7767 19.1945 17.6543 19.21 17.5313 19.21H6.46829C5.65737 19.21 5 18.5522 5 17.7408C5 17.628 5.01299 17.5156 5.03871 17.4057C5.14178 16.9655 5.24535 16.6419 5.34941 16.4351C6.25979 14.6253 8.11317 13.3794 11.8785 13.3334ZM12.0001 4C14.1479 4 15.889 5.74111 15.889 7.88889C15.889 10.0367 14.1479 11.7778 12.0001 11.7778C9.85233 11.7778 8.11122 10.0367 8.11122 7.88889C8.11122 5.74111 9.85233 4 12.0001 4Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
));

export { PersonIcon };
