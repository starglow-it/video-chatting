import React from 'react';
import { CommonIconProps } from '@library/types';

export type OptionItemProps = {
    isActive: boolean;
    nameSpace: string;
    translationKey: string;
    Icon: React.FunctionComponent<CommonIconProps>;
    onClick: () => void;
};
