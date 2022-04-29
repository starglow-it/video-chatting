import React, { memo, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// custom
import { CustomRadioGroup } from '@library/custom/CustomRadioGroup/CustomRadioGroup';

// components
import { ChooseSignBoardProps } from '@components/Templates/ChooseSignBoard/types';
import { SignBoardOption } from './SignBoardOption';

// styles
import styles from './ChooseSignBoard.module.scss';

// const
import { SIGN_BOARDS } from '../../../const/signBoards';

// types

const Component: React.FunctionComponent<ChooseSignBoardProps> = ({
    optionWidth,
    optionHeight,
}) => {
    const { control, register } = useFormContext();

    const renderSignOptions = useMemo(
        () =>
            SIGN_BOARDS.map(signOption => (
                <SignBoardOption
                    key={signOption.id}
                    data={signOption}
                    width={optionWidth}
                    height={optionHeight}
                />
            )),
        [],
    );

    return (
        <Controller
            render={({ field }) => (
                <CustomRadioGroup
                    classes={{
                        root: styles.radioGroup,
                    }}
                    row
                    {...field}
                    defaultValue={SIGN_BOARDS[0].value}
                >
                    {renderSignOptions}
                </CustomRadioGroup>
            )}
            {...register('signBoard')}
            control={control}
            name="signBoard"
            defaultValue={SIGN_BOARDS[0].value}
        />
    );
};

export const ChooseSignBoard = memo(Component);
