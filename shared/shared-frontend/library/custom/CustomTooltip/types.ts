import React from 'react';

export type CustomTooltipProps = {
    children: React.ReactElement;
    popperClassName?: string;
    tooltipClassName?: string;
    title: JSX.Element | string;
    variant?: 'primary' | 'black-glass' | 'white';
};
