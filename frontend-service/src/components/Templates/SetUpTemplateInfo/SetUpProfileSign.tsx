import React, { memo, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomRadioGroup } from '@library/custom/CustomRadioGroup/CustomRadioGroup';

// components
import { SignBoardOption } from './SignBoardOption';

import styles from './SetUpTemplateInfo.module.scss';

const signOptions = [
    {
        id: 0,
        label: 'Default',
        value: 'default',
    },
    {
        id: 1,
        label: 'Wooden 1',
        value: 'wooden_1',
    },
    {
        id: 2,
        label: 'Wooden 2',
        value: 'wooden_2',
    },
    {
        id: 3,
        label: 'Wooden 3',
        value: 'wooden_3',
    },
    {
        id: 4,
        label: 'Wooden 4',
        value: 'wooden_4',
    },
    {
        id: 5,
        label: 'Wooden 5',
        value: 'wooden_5',
    },
];

function Component() {
    const { control, register } = useFormContext();

    const renderSignOptions = useMemo(
        () =>
            signOptions.map(signOption => (
                <SignBoardOption key={signOption.id} data={signOption} />
            )),
        [],
    );

    return (
        <CustomGrid container direction="column" gap={1.75}>
            <CustomTypography
                nameSpace="templates"
                translation="setUpSpace.customizeSign"
                variant="h2bold"
            />
            <Controller
                render={({ field }) => (
                    <CustomRadioGroup
                        classes={{
                            root: styles.radioGroup,
                        }}
                        row
                        {...field}
                        defaultValue={signOptions[0].value}
                    >
                        {renderSignOptions}
                    </CustomRadioGroup>
                )}
                {...register('signBoard')}
                control={control}
                name="signBoard"
                defaultValue={signOptions[0].value}
            />
        </CustomGrid>
    );
}

export const SetUpProfileSign = memo(Component);
