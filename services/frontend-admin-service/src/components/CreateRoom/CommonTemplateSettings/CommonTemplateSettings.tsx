import { memo, useCallback, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { generateKeyByLabel, getRandomHexColor } from 'shared-utils';
import { MenuItem } from '@mui/material';

import { IBusinessCategory } from 'shared-types';

// shred
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { ErrorMessage } from 'shared-frontend/library/common/ErrorMessage';
import { CustomAutocomplete } from 'shared-frontend/library/custom/CustomAutocomplete';
import { CustomDropdown } from 'shared-frontend/library/custom/CustomDropdown';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomInput } from 'shared-frontend/library/custom/CustomInput';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { ArrowDownIcon } from 'shared-frontend/icons/OtherIcons/ArrowDownIcon';
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';
import { ArrowRightIcon } from 'shared-frontend/icons/OtherIcons/ArrowRightIcon';
import { AutocompleteType } from 'shared-frontend/types';

// components
import { Translation } from '@components/Translation/Translation';

import {
    MAX_DESCRIPTION_LENGTH,
    MAX_NAME_LENGTH,
    MAX_PARTICIPANTS_NUMBER,
} from 'shared-const';

import { CommonTemplateSettingsProps } from './CommonTemplateSettings.types';

import styles from './CommonTemplateSettings.module.scss';

const participantsNumberValues = Array.from(
    {
        length: MAX_PARTICIPANTS_NUMBER - 1,
    },
    (_, i) => ({
        id: `${i + 2}`,
        value: i + 2,
    }),
);

const Component = ({
    onNextStep,
    onPreviousStep,
    categories,
}: CommonTemplateSettingsProps) => {
    const {
        register,
        control,
        trigger,
        setError,
        setValue,
        clearErrors,
        formState: { errors },
    } = useFormContext();

    const description = useWatch({
        control,
        name: 'description',
    });
    const tags = useWatch({
        control,
        name: 'tags',
    });

    const participantsNumber = useWatch({
        control,
        name: 'participantsNumber',
    });

    const nameErrorMessage: string = errors?.name?.[0]?.message || '';
    const descriptionErrorMessage: string =
        errors?.description?.[0]?.message || '';
    const tagsErrorMessage: string = errors?.tags?.[0]?.message || '';

    useEffect(() => {
        (async () => {
            if (
                !tags.find(
                    (value: AutocompleteType<IBusinessCategory> | string) =>
                        typeof value === 'string',
                )
            ) {
                return;
            }

            setValue(
                'tags',
                tags.map((item: AutocompleteType<IBusinessCategory> | string) =>
                    typeof item === 'string'
                        ? {
                              label: item,
                              key: generateKeyByLabel(item),
                              value: item,
                              color: getRandomHexColor(50, 220),
                          }
                        : item,
                ),
            );
        })();
    }, [tags]);

    const handleClickNextStep = useCallback(async () => {
        const isNextClickValidation = await trigger([
            'name',
            'description',
            'tags',
        ]);

        if (isNextClickValidation) {
            clearErrors();
            onNextStep();
        }
    }, []);

    const { onChange: onChangeName, ...nameProps } = useMemo(
        () => register('name'),
        [],
    );
    const participantsNumberProps = useMemo(
        () => register('participantsNumber'),
        [],
    );
    const { onChange: onChangeDescription, ...descriptionProps } = useMemo(
        () => register('description'),
        [],
    );

    const handleChangeDescription = useCallback(event => {
        let messageError = '';

        if (event.target.value.length > MAX_DESCRIPTION_LENGTH) {
            // eslint-disable-next-line no-param-reassign
            event.target.value = event.target.value.slice(
                0,
                MAX_DESCRIPTION_LENGTH,
            );
            messageError = `maxLength.${MAX_DESCRIPTION_LENGTH}`;
        }

        if (messageError) {
            setError('description', [
                {
                    message: messageError,
                    type: 'focus',
                },
            ]);
        } else {
            clearErrors('description');
        }

        onChangeDescription(event);
    }, []);

    const handleChangeName = useCallback(event => {
        let messageError = '';

        if (event.target.value.length > MAX_NAME_LENGTH) {
            // eslint-disable-next-line no-param-reassign
            event.target.value = event.target.value.slice(0, MAX_NAME_LENGTH);
            messageError = `maxLength.${MAX_NAME_LENGTH}`;
        }

        if (messageError) {
            setError('name', [
                {
                    type: 'focus',
                    message: messageError,
                },
            ]);
        } else {
            clearErrors('name');
        }

        onChangeName(event);
    }, []);

    const participantsNumberList = useMemo(
        () =>
            participantsNumberValues.map(({ id, value }) => (
                <MenuItem key={id} value={value}>
                    <CustomTypography>{value}</CustomTypography>
                </MenuItem>
            )),
        [],
    );

    const businessCategoriesOptions = useMemo(
        () =>
            categories.map(item => ({
                ...item,
                label: item.value,
            })),
        [categories],
    );

    return (
        <CustomGrid container justifyContent="center" alignItems="center">
            <CustomPaper variant="black-glass" className={styles.paper}>
                <CustomGrid container direction="column" gap={3}>
                    <CustomGrid container direction="column" gap={0.5}>
                        <CustomTypography
                            variant="body3"
                            color="colors.white.primary"
                            className={styles.label}
                        >
                            <Translation
                                nameSpace="rooms"
                                translation="editDescription.form.roomName"
                            />
                        </CustomTypography>

                        <CustomGrid
                            container
                            flexWrap="nowrap"
                            gap={2}
                            columns={10}
                        >
                            <CustomGrid container>
                                <CustomInput
                                    autoComplete="off"
                                    color="secondary"
                                    error={nameErrorMessage}
                                    onChange={handleChangeName}
                                    {...nameProps}
                                />
                                <ErrorMessage error={Boolean(nameErrorMessage)}>
                                    <Translation
                                        nameSpace="errors"
                                        translation={nameErrorMessage}
                                    />
                                </ErrorMessage>
                            </CustomGrid>
                        </CustomGrid>
                    </CustomGrid>
                    <CustomGrid container direction="column" gap={0.5}>
                        <CustomGrid
                            container
                            justifyContent="space-between"
                            className={styles.label}
                        >
                            <CustomTypography
                                variant="body3"
                                color="colors.white.primary"
                            >
                                <Translation
                                    nameSpace="rooms"
                                    translation="editDescription.form.description"
                                />
                            </CustomTypography>
                            <CustomTypography
                                variant="body3"
                                color="colors.white.primary"
                            >
                                {`${description.length}/${MAX_DESCRIPTION_LENGTH}`}
                            </CustomTypography>
                        </CustomGrid>
                        <CustomInput
                            color="secondary"
                            autoComplete="off"
                            onChange={handleChangeDescription}
                            error={descriptionErrorMessage}
                            multiline
                            rows={3}
                            {...descriptionProps}
                        />
                        <ErrorMessage error={Boolean(descriptionErrorMessage)}>
                            <Translation
                                nameSpace="errors"
                                translation={descriptionErrorMessage}
                            />
                        </ErrorMessage>
                    </CustomGrid>

                    <CustomGrid container direction="column" gap={0.5}>
                        <CustomTypography
                            variant="body3"
                            color="colors.white.primary"
                            className={styles.label}
                        >
                            <Translation
                                nameSpace="rooms"
                                translation="editDescription.form.tags"
                            />
                        </CustomTypography>
                        <CustomAutocomplete<AutocompleteType<IBusinessCategory>>
                            multiple
                            withInputValue
                            freeSolo
                            includeInputInList
                            disableClearable
                            autoHighlight
                            options={businessCategoriesOptions}
                            control={control}
                            name="tags"
                            autoComplete
                            error={tagsErrorMessage}
                            errorComponent={
                                <ErrorMessage error={Boolean(tagsErrorMessage)}>
                                    <Translation
                                        nameSpace="errors"
                                        translation={tagsErrorMessage}
                                    />
                                </ErrorMessage>
                            }
                        />
                    </CustomGrid>
                </CustomGrid>
            </CustomPaper>

            <CustomGrid
                container
                gap={1.5}
                flexWrap="nowrap"
                justifyContent="center"
                className={styles.buttonsGroup}
            >
                <ActionButton
                    variant="gray"
                    Icon={<ArrowLeftIcon width="32px" height="32px" />}
                    className={styles.actionButton}
                    onAction={onPreviousStep}
                />
                <ActionButton
                    variant="accept"
                    Icon={<ArrowRightIcon width="32px" height="32px" />}
                    className={styles.actionButton}
                    onAction={handleClickNextStep}
                />
            </CustomGrid>
        </CustomGrid>
    );
};

export const CommonTemplateSettings = memo(Component);
