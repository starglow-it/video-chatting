import React, {memo, useCallback, useEffect, useMemo} from "react";
import {useFormContext, useWatch} from "react-hook-form";
import {generateKeyByLabel, getRandomHexColor} from "shared-utils";
import {MenuItem} from "@mui/material";

import {IBusinessCategory} from "shared-types";
import {
    ActionButton,
    ArrowDownIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    AutocompleteType,
    ConditionalRender,
    CustomAutocomplete,
    CustomDropdown,
    CustomGrid,
    CustomInput,
    CustomPaper,
    CustomTypography,
    ErrorMessage
} from "shared-frontend";
import {
    MAX_DESCRIPTION_LENGTH,
    MAX_NAME_LENGTH,
    MAX_PARTICIPANTS_NUMBER
} from "shared-const";

import { Translation } from '@components/Translation/Translation';

import {CommonTemplateSettingsProps} from "./CommonTemplateSettings.types";

import styles from './CommonTemplateSettings.module.scss';

const participantsNumberValues = Array.from({ length: MAX_PARTICIPANTS_NUMBER }, (_, i) => ({
    id: `${i + 1}`,
    value: i + 1,
}));

const Component = ({ onNextStep, onPreviousStep, categories }: CommonTemplateSettingsProps) => {
    const {
        register,
        control,
        trigger,
        setError,
        setValue,
        formState: { errors },
    } = useFormContext();

    const description = useWatch({ control, name: 'description' });
    const tags = useWatch({ control, name: 'tags' });

    const participantsNumber = useWatch({
        control,
        name: 'participantsNumber',
    });

    useEffect(() => {
        trigger('tags');

        if (
            !tags.find(
                (value: AutocompleteType<IBusinessCategory> | string) => typeof value === 'string',
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
    }, [tags]);

    const handleClickNextStep = useCallback(async () => {
        const response = await trigger(['name', 'description', 'tags']);

        if (response) {
            onNextStep();
        }
    }, []);

    const { onChange: onChangeName, ...nameProps } = useMemo(() => register('name'), []);
    const participantsNumberProps = useMemo(() => register('participantsNumber'), []);
    const { onChange: onChangeDescription, ...descriptionProps } = useMemo(
        () => register('description'),
        [],
    );

    const handleChangeDescription = useCallback(event => {
        if (event.target.value.length > MAX_DESCRIPTION_LENGTH) {
            // eslint-disable-next-line no-param-reassign
            event.target.value = event.target.value.slice(0, MAX_DESCRIPTION_LENGTH);
            setError('description', [
                { type: 'focus', message: `maxLength.${MAX_DESCRIPTION_LENGTH}` },
            ]);
        } else {
            setError('description', [{ message: '', type: 'focus' }]);
        }
        onChangeDescription(event);
    }, []);

    const handleChangeName = useCallback(event => {
        if (event.target.value.length > MAX_NAME_LENGTH) {
            // eslint-disable-next-line no-param-reassign
            event.target.value = event.target.value.slice(0, MAX_NAME_LENGTH);
            setError('name', [{ type: 'focus', message: `maxLength.${MAX_NAME_LENGTH}` }]);
        } else {
            setError('name', [{ message: '', type: 'focus' }]);
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
        () => categories.map(item => ({ ...item, label: item.value })),
        [categories],
    );

    const nameErrorMessage: string = errors?.name?.[0]?.message || '';
    const descriptionErrorMessage: string = errors?.description?.[0]?.message || '';
    const tagsErrorMessage: string = errors?.tags?.[0]?.message || '';

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
                                translation="editDescription.form.nameAndAttendees"
                            />
                        </CustomTypography>

                        <CustomGrid container flexWrap="nowrap" gap={2} columns={10}>
                            <CustomGrid item xs={8}>
                                <CustomInput
                                    autoComplete="off"
                                    color="secondary"
                                    error={nameErrorMessage}
                                    onChange={handleChangeName}
                                    {...nameProps}
                                />
                            </CustomGrid>
                            <CustomGrid item xs={2}>
                                <CustomDropdown
                                    selectId="1"
                                    variant="transparent"
                                    value={participantsNumber}
                                    list={participantsNumberList}
                                    IconComponent={ArrowDownIcon}
                                    {...participantsNumberProps}
                                />
                            </CustomGrid>
                        </CustomGrid>
                    </CustomGrid>
                    <CustomGrid container direction="column" gap={0.5}>
                        <CustomGrid container justifyContent="space-between" className={styles.label}>
                            <CustomTypography
                                variant="body3"
                                color="colors.white.primary"
                            >
                                <Translation
                                    nameSpace="rooms"
                                    translation="editDescription.form.description"
                                />
                            </CustomTypography>
                            <CustomTypography variant="body3" color="colors.white.primary">
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
                                <ConditionalRender condition={Boolean(tagsErrorMessage)}>
                                    <ErrorMessage error={Boolean(tagsErrorMessage)}>
                                        <Translation
                                            nameSpace="errors"
                                            translation={tagsErrorMessage}
                                        />
                                    </ErrorMessage>
                                </ConditionalRender>
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
    )
}

export const CommonTemplateSettings = memo(Component);