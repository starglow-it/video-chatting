import React, { memo } from 'react';

// custom
import { CustomSwitch } from '@library/custom/CustomSwitch/CustomSwitch';
import { CustomGrid } from 'shared-frontend/library';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// types
import { LabeledSwitchProps } from './types';

const Component = ({
    Icon,
    nameSpace,
    translation,
    checked,
    color,
    onChange,
    className,
    SwitchComponent,
    ...rest
}: LabeledSwitchProps) => (
    <CustomGrid
        container
        gap={1}
        className={className}
        justifyContent="space-between"
        wrap="nowrap"
    >
        <CustomGrid container wrap="nowrap">
            {Icon}
            <CustomTypography color={color} nameSpace={nameSpace} translation={translation} />
        </CustomGrid>
        {SwitchComponent || <CustomSwitch checked={checked} onChange={onChange} {...rest} />}
    </CustomGrid>
);

export const LabeledSwitch = memo(Component);
