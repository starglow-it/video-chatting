import React from 'react';

export type CustomTooltipProps = {
    children: React.ReactElement;
    popperClassName?: string;
    title?: JSX.Element | string;
    variant?: 'primary' | 'black-glass';
};
