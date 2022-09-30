import { CommonIconProps } from '@library/types';
import { memo } from 'react';
import { SvgIconWrapper } from './SvgIconWrapper';

const Icon = ({ width, height, className, onClick }: CommonIconProps) => (
    <SvgIconWrapper
        onClick={onClick}
        className={className}
        width={width}
        height={height}
        viewBox="0 0 48 48"
        fill="none"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M33.8995 14.1007C34.6805 14.8817 34.6805 16.148 33.8995 16.9291L26.8284 24.0002L33.8995 31.0712C34.6805 31.8523 34.6805 33.1186 33.8995 33.8997C33.1184 34.6807 31.8521 34.6807 31.0711 33.8997L24 26.8286L16.9289 33.8997C16.1479 34.6807 14.8816 34.6807 14.1005 33.8997C13.3195 33.1186 13.3195 31.8523 14.1005 31.0712L21.1716 24.0002L14.1005 16.9291C13.3195 16.148 13.3195 14.8817 14.1005 14.1007C14.8816 13.3196 16.1479 13.3196 16.9289 14.1007L24 21.1717L31.0711 14.1007C31.8521 13.3196 33.1184 13.3196 33.8995 14.1007Z"
            fill="currentColor"
        />
    </SvgIconWrapper>
);

export const CloseIcon = memo<CommonIconProps>(Icon);
