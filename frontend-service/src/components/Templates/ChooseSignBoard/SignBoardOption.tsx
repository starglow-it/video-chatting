import React, { memo, useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import clsx from 'clsx';
import Image from 'next/image';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomRadio } from '@library/custom/CustomRadio/CustomRadio';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import FormControlLabel from '@mui/material/FormControlLabel';

// icon
import { RadioIcon } from '@library/icons/RadioIcon';

// styles
import styles from './ChooseSignBoard.module.scss';

// types
import { SignOptionProps } from './types';

const Component: React.FunctionComponent<SignOptionProps> = ({ data, width, height }) => {
    const { control, setValue } = useFormContext();

    const activeSignBoard = useWatch({
        control,
        name: 'signBoard',
    });

    const handleChooseSign = useCallback(() => {
        setValue('signBoard', data.value, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, []);

    return (
        <CustomGrid
            container
            direction="column"
            className={styles.radioOption}
            sx={{ width }}
            gap={1.5}
        >
            <FormControlLabel
                key={data.id}
                value={data.value}
                label={data.label}
                control={
                    <CustomRadio
                        icon={<RadioIcon className={styles.icon} width="22px" height="22px" />}
                        checkedIcon={
                            <RadioIcon checked className={styles.icon} width="22px" height="22px" />
                        }
                    />
                }
            />
            <CustomGrid
                onClick={handleChooseSign}
                className={clsx(styles.signBoardWrapper, {
                    [styles.checked]: data.value === activeSignBoard,
                })}
            >
                {data.value === 'default' ? (
                    <CustomGrid
                        className={styles.defaultSignWrapper}
                        sx={{ width, height }}
                        container
                        justifyContent="center"
                        alignItems="center"
                    >
                        <CustomTypography
                            color="colors.white.primary"
                            nameSpace="templates"
                            translation="noSignBoard"
                        />
                    </CustomGrid>
                ) : (
                    <Image
                        src={`/images/boards/${data.value}.png`}
                        width={`${width}px`}
                        height={`${height}px`}
                    />
                )}
            </CustomGrid>
        </CustomGrid>
    );
};
export const SignBoardOption = memo(Component);
