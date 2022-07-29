import React, { memo } from 'react';

// custom
import { CustomSwitch } from '@library/custom/CustomSwitch/CustomSwitch';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// types
import { LabeledSwitchProps } from './types';

const Component = ({
    Icon,
    nameSpace,
    translation,
    checked,
    onChange,
    className,
    SwitchComponent,
    ...rest
}: LabeledSwitchProps) => {
    return (
        <CustomGrid
            container
            gap={1}
            className={className}
            justifyContent="space-between"
            wrap="nowrap"
        >
            <CustomGrid container wrap="nowrap">
                {Icon}
                <CustomTypography nameSpace={nameSpace} translation={translation} />
            </CustomGrid>
            {SwitchComponent || <CustomSwitch checked={checked} onChange={onChange} {...rest} />}
        </CustomGrid>
    );
};

export const LabeledSwitch = memo(Component);
