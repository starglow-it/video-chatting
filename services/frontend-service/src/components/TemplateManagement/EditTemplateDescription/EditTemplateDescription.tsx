import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useStore } from 'effector-react';
import { MenuItem } from '@mui/material';

import { IBusinessCategory } from 'shared-types';
import { AutocompleteType } from 'shared-frontend/types';

import { CustomAutocomplete } from 'shared-frontend';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from 'shared-frontend/library';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomDropdown } from '@library/custom/CustomDropdown/CustomDropdown';
import { ActionButton } from '@library/common/ActionButton/ActionButton';

// icons
import { ArrowLeftIcon } from 'shared-frontend/icons';
import { CustomLinkIcon } from 'shared-frontend/icons';
import { ArrowDownIcon } from 'shared-frontend/icons';
import { ArrowRightIcon } from 'shared-frontend/icons';

// types
import { EditTemplateDescriptionProps } from '@components/TemplateManagement/EditTemplateDescription/types';

// stores
import { getRandomHexColor } from 'shared-utils';
import {
    $businessCategoriesStore,
    checkCustomLinkFx,
    getBusinessCategoriesFx,
} from '../../../store';

// const
import {
    MAX_DESCRIPTION_LENGTH,
    MAX_NAME_LENGTH,
    MAX_PARTICIPANTS_NUMBER,
} from '../../../const/templates/info';
import frontendConfig from '../../../const/config';

// styles
import styles from './EditTemplateDescription.module.scss';

// utils
import { generateKeyByLabel } from '../../../utils/businessCategories/generateKeyByLabel';

const participantsNumberValues = Array.from({ length: MAX_PARTICIPANTS_NUMBER }, (_, i) => ({
    id: `${i + 1}`,
    value: i + 1,
}));

const Component = ({ onNextStep, onPreviousStep }: EditTemplateDescriptionProps) => {
    const businessCategories = useStore($businessCategoriesStore);

    const {
        register,
        control,
        trigger,
        setError,
        setValue,
        clearErrors,
        formState: { errors },
    } = useFormContext();

    const description = useWatch({ control, name: 'description' });
    const customLink = useWatch({ control, name: 'customLink' });
    const tags = useWatch({ control, name: 'tags' });

    const participantsNumber = useWatch({
        control,
        name: 'participantsNumber',
    });

    useEffect(() => {
        (() => {
            getBusinessCategoriesFx({});
        })();
    }, []);

    useEffect(() => {
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
        trigger('tags');
    }, [tags]);

    const handleClickNextStep = useCallback(async () => {
        const response = await trigger(['name', 'description', 'tags', 'customLink']);

        const isBusy = await checkCustomLinkFx({
            templateId: customLink,
        });

        if (isBusy) {
            setError('customLink', [
                { type: 'focus', message: 'meeting.settings.customLink.busy' },
            ]);
            return;
        } 
            clearErrors('customLink');
        

        if (response) {
            onNextStep();
        }
    }, [onNextStep, customLink]);

    const { onChange: onChangeName, ...nameProps } = useMemo(() => register('name'), []);
    const customLinkProps = useMemo(() => register('customLink'), []);
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

    const customLinkInputProps = useMemo(
        () => ({
            startAdornment: <CustomLinkIcon width="24px" height="24px" />,
        }),
        [],
    );

    const businessCategoriesOptions = useMemo(
        () => businessCategories.list.map(item => ({ ...item, label: item.value })),
        [businessCategories.list],
    );

    const nameErrorMessage: string = errors?.name?.[0]?.message || '';
    const descriptionErrorMessage: string = errors?.description?.[0]?.message || '';
    const tagsErrorMessage: string = errors?.tags?.[0]?.message || '';
    const customLinkErrorMessage: string = errors?.customLink?.[0]?.message || '';

    return (
        <CustomGrid
            container
            alignItems="center"
            justifyContent="center"
            className={styles.wrapper}
        >
            <CustomPaper variant="black-glass" className={styles.paper}>
                <CustomGrid container direction="column">
                    <CustomTypography
                        variant="body3"
                        color="colors.white.primary"
                        nameSpace="createRoom"
                        translation="editDescription.form.nameAndAttendees"
                        className={styles.label}
                    />
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
                    <CustomGrid container justifyContent="space-between" className={styles.label}>
                        <CustomTypography
                            variant="body3"
                            color="colors.white.primary"
                            nameSpace="createRoom"
                            translation="editDescription.form.description"
                        />
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
                    <CustomTypography
                        variant="body3"
                        color="colors.white.primary"
                        nameSpace="createRoom"
                        translation="editDescription.form.tags"
                        className={styles.label}
                    />
                    <CustomAutocomplete<AutocompleteType<IBusinessCategory>>
                        multiple
                        freeSolo
                        includeInputInList
                        disableClearable
                        autoHighlight
                        options={businessCategoriesOptions}
                        control={control}
                        name="tags"
                        autoComplete
                        error={tagsErrorMessage}
                    />
                    <CustomGrid
                        container
                        gap={2}
                        flexWrap="nowrap"
                        justifyContent="space-between"
                        className={styles.label}
                    >
                        <CustomTypography
                            variant="body3"
                            color="colors.white.primary"
                            nameSpace="createRoom"
                            translation="editDescription.form.link"
                            className={styles.linkLabel}
                        />
                        <CustomTypography variant="body3" className={styles.customLinkPreview}>
                            {`${frontendConfig.frontendUrl}/.../${customLink}`}
                        </CustomTypography>
                    </CustomGrid>
                    <CustomInput
                        autoComplete="off"
                        color="secondary"
                        InputProps={customLinkInputProps}
                        error={customLinkErrorMessage}
                        {...customLinkProps}
                    />
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

export const EditTemplateDescription = memo(Component);
