import React, { memo, useCallback, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// custom
import { CustomRadioGroup } from '@library/custom/CustomRadioGroup/CustomRadioGroup';

// components
import { SignBoardOption } from './SignBoardOption';

// styles
import styles from './ChooseSignBoard.module.scss';

// const
import { SIGN_BOARDS } from '../../../const/signBoards';

// types
import { ChooseSignBoardProps } from './types';

const Component: React.FunctionComponent<ChooseSignBoardProps> = ({
    optionWidth,
    optionHeight,
    formKey,
}) => {
    const { control } = useFormContext();

    const [openBoardsType, setOpenBoardsType] = useState('');

    const handleSetOpenBoardsType = useCallback((value: string) => {
        setOpenBoardsType(value);
    }, []);

    const renderSignOptions = useMemo(
        () =>
            SIGN_BOARDS.map(signBoardSet => (
                <SignBoardOption
                    key={signBoardSet[0]?.id}
                    formKey={formKey}
                    data={signBoardSet}
                    width={optionWidth}
                    height={optionHeight}
                    openBoardsType={openBoardsType}
                    onOpenBoardsType={handleSetOpenBoardsType}
                />
            )),
        [openBoardsType],
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
                    defaultValue={SIGN_BOARDS[0][0].value}
                >
                    {renderSignOptions}
                </CustomRadioGroup>
            )}
            name={formKey}
            control={control}
            defaultValue={SIGN_BOARDS[0][0].value}
        />
    );
};

export const ChooseSignBoard = memo(Component);
