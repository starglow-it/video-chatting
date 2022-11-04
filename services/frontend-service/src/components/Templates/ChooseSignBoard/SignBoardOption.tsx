import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomRadio } from '@library/custom/CustomRadio/CustomRadio';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomPopper } from '@library/custom/CustomPopper/CustomPopper';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import FormControlLabel from '@mui/material/FormControlLabel';

// icon
import { RadioIcon } from '@library/icons/RadioIcon';
import { ColorPickerIcon } from '@library/icons/ColorPickerIcon';

// shared
import { CustomImage } from 'shared-frontend/library';

// styles
import styles from './ChooseSignBoard.module.scss';

// types
import { SignOptionProps } from './types';

const Component: React.FunctionComponent<SignOptionProps> = ({
    openBoardsType,
    onOpenBoardsType,
    formKey,
    data,
    width,
    height,
}) => {
    const { control, setValue } = useFormContext();

    const boardsRef = useRef(null);

    const activeSignBoard = useWatch({
        control,
        name: formKey,
    });

    const prevBoard = useRef('');

    const defaultSetData = data[0];
    const activeBoardData = useMemo(
        () => data.find(board => board.value === activeSignBoard),
        [data, activeSignBoard],
    );
    const isActiveSet = data?.some(board => board.value === activeSignBoard);

    useEffect(() => {
        if (activeBoardData?.value) {
            prevBoard.current = activeBoardData.value;
        }

        onOpenBoardsType('');
    }, [activeBoardData?.value]);

    const prevBoardData = data.find(board => board.value === prevBoard.current);

    const handleOpenVariantOptions = useCallback(() => {
        onOpenBoardsType(defaultSetData.type === activeBoardData?.value ? '' : defaultSetData.type);
    }, []);

    const handleChooseSign = useCallback(() => {
        setValue(formKey, prevBoard.current || defaultSetData?.value, {
            shouldValidate: true,
            shouldDirty: true,
        });
        onOpenBoardsType('');
    }, [defaultSetData?.value]);

    const renderAllVariants = useMemo(
        () =>
            data.map(variant => {
                const handleChooseCertainBoard = () => {
                    setValue(formKey, variant?.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                    });
                    onOpenBoardsType('');
                };
                return (
                    <CustomGrid
                        key={variant.value}
                        item
                        onClick={handleChooseCertainBoard}
                        className={clsx(styles.variantItem, {
                            [styles.active]: activeSignBoard === variant.value,
                        })}
                    >
                        <CustomImage
                            src={`/images/boards/${variant.type}/${variant.value}.png`}
                            width="45px"
                            height="27px"
                        />
                    </CustomGrid>
                );
            }),
        [data, formKey, activeSignBoard],
    );

    const imageType = activeBoardData?.type ?? prevBoardData?.type ?? defaultSetData.type;
    const imageValue = activeBoardData?.value ?? prevBoardData?.value ?? defaultSetData?.value;

    return (
        <CustomGrid
            container
            direction="column"
            className={styles.radioOption}
            sx={{ width }}
            gap={1.5}
        >
            <CustomGrid container justifyContent="space-between" alignItems="center">
                <FormControlLabel
                    value={prevBoardData?.value ?? defaultSetData.value}
                    label={prevBoardData?.type ?? defaultSetData?.type}
                    classes={{
                        root: clsx(styles.label, { [styles.active]: isActiveSet }),
                    }}
                    control={
                        <CustomRadio
                            icon={<RadioIcon className={styles.icon} width="22px" height="22px" />}
                            checkedIcon={
                                <RadioIcon
                                    checked
                                    className={styles.icon}
                                    width="22px"
                                    height="22px"
                                />
                            }
                        />
                    }
                />

                <ConditionalRender condition={data?.length > 1}>
                    <CustomGrid
                        ref={boardsRef}
                        className={styles.chooseVariant}
                        onClick={handleOpenVariantOptions}
                    >
                        <ColorPickerIcon width="20px" height="20px" />
                    </CustomGrid>
                    <CustomPopper
                        id="signboardVariants"
                        open={openBoardsType === defaultSetData.type}
                        anchorEl={boardsRef.current}
                    >
                        <CustomPaper>
                            <CustomGrid
                                className={styles.signBoardVariants}
                                container
                                direction="column"
                                gap={1}
                            >
                                <CustomTypography
                                    variant="body2"
                                    nameSpace="templates"
                                    translation="signBoards.chooseVariant.title"
                                />
                                <CustomGrid container wrap="nowrap" gap={1}>
                                    {renderAllVariants}
                                </CustomGrid>
                            </CustomGrid>
                        </CustomPaper>
                    </CustomPopper>
                </ConditionalRender>
            </CustomGrid>

            <CustomGrid
                onClick={handleChooseSign}
                className={clsx(styles.signBoardWrapper, {
                    [styles.checked]: isActiveSet,
                })}
            >
                {defaultSetData.type === 'default' ? (
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
                    <CustomImage
                        src={`/images/boards/${imageType}/${imageValue}.png`}
                        width={`${width}px`}
                        height={`${height}px`}
                    />
                )}
            </CustomGrid>
        </CustomGrid>
    );
};
export const SignBoardOption = memo(Component);
