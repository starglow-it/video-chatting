import React from 'react';

export type CommonIconProps = {
    width: string;
    height: string;
    className?: string;
    isActive?: boolean;
    style?: React.CSSProperties;
    onClick?: React.MouseEventHandler<SVGSVGElement> | undefined;
    onMouseDown?: React.MouseEventHandler<SVGSVGElement> | undefined;
};

export type SliderArrowProps = {
    customClassName?: string;
    style?: string;
    onClick?: () => void;
    dotsRef: React.RefObject<any>;
};