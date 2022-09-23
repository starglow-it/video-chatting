import React, { memo, useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { MenuItem } from '@mui/material';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomAutocomplete } from '@library/custom/CustomAutocomplete/CustomAutocomplete';
import { CustomDropdown } from '@library/custom/CustomDropdown/CustomDropdown';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// icons
import { ArrowLeftIcon } from '@library/icons/ArrowLeftIcon';
import { CustomLinkIcon } from '@library/icons/CustomLinkIcon';
import { ArrowDownIcon } from '@library/icons/ArrowDownIcon';

// types
import { EditTemplateDescriptionProps } from '@components/CreateRoom/EditTemplateDescription/types';

// const
import { MAX_DESCRIPTION_LENGTH, MAX_PARTICIPANTS_NUMBER } from '../../../const/templates/info';
import publicRuntimeConfig from '../../../const/config';

import styles from './EditTemplateDescription.module.scss';

const participantsNumberValues = Array.from({ length: MAX_PARTICIPANTS_NUMBER }, (_, i) => ({
    id: `${i + 1}`,
    value: i + 1,
}));

const Component = ({ onNextStep, onPreviousStep }: EditTemplateDescriptionProps) => {
    const {
        register,
        control,
        trigger,
        formState: { errors },
    } = useFormContext();

    const description = useWatch({ control, name: 'description' });
    const customLink = useWatch({ control, name: 'customLink' });

    const participantsNumber = useWatch({
        control,
        name: 'participantsNumber',
    });

    const handleClickNextStep = useCallback(async () => {
        const response = await trigger(['name', 'description', 'tags', 'customLink']);
        if (response) {
            onNextStep();
        }
    }, [onNextStep]);

    const nameProps = useMemo(() => register('name'), []);
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
        }
        onChangeDescription(event);
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

    const nameErrorMessage: string = errors?.name?.[0]?.message || '';
    const descriptionErrorMessage: string = errors?.description?.[0]?.message || '';
    const tagsErrorMessage: string = errors?.tags?.[0]?.message || '';

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
                        <CustomGrid xs={8}>
                            <CustomInput
                                color="secondary"
                                error={nameErrorMessage}
                                {...nameProps}
                            />
                        </CustomGrid>
                        <CustomGrid xs={2}>
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
                        onChange={handleChangeDescription}
                        error={descriptionErrorMessage}
                        {...descriptionProps}
                    />
                    <CustomTypography
                        variant="body3"
                        color="colors.white.primary"
                        nameSpace="createRoom"
                        translation="editDescription.form.tags"
                        className={styles.label}
                    />
                    <CustomAutocomplete
                        multiple
                        freeSolo
                        includeInputInList
                        disableClearable
                        autoHighlight
                        options={[]} // TODO: populate
                        control={control}
                        name="tags"
                        autoComplete={false}
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
                        <ConditionalRender condition={customLink}>
                            <CustomTypography variant="body3" className={styles.customLinkPreview}>
                                {`${publicRuntimeConfig.frontendUrl}/.../${customLink}`}
                            </CustomTypography>
                        </ConditionalRender>
                    </CustomGrid>
                    <CustomInput
                        color="secondary"
                        InputProps={customLinkInputProps}
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
                    Icon={<ArrowLeftIcon width="24px" height="24px" />}
                    className={styles.actionButton}
                    onAction={onPreviousStep}
                />
                <ActionButton
                    variant="accept"
                    Icon={<ArrowLeftIcon width="24px" height="24px" className={styles.icon} />}
                    className={styles.actionButton}
                    onAction={handleClickNextStep}
                />
            </CustomGrid>
        </CustomGrid>
    );
};

export const EditTemplateDescription = memo(Component);
