import { memo, useCallback, useState, useEffect, useMemo, useRef, MouseEvent } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import { useToggle } from '@hooks/useToggle';

import { IBusinessCategory } from 'shared-types';
import { AutocompleteType } from 'shared-frontend/types';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { ErrorMessage } from 'shared-frontend/library/common/ErrorMessage';
import { CustomAutocomplete } from 'shared-frontend/library/custom/CustomAutocomplete';
import { Translation } from '@library/common/Translation/Translation';
import { CustomSwitch } from '@library/custom/CustomSwitch/CustomSwitch';
import { MonetizationSwitchComponent } from '@library/custom/CustomSwitch/MonetizationSwitchComponent';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomPopover } from '@library/custom/CustomPopover/CustomPopover';
import { MeetingMonetization } from '../../Meeting/MeetingMonetization/MeetingMonetization';

// icons
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';
import { CustomLinkIcon } from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';
import { ArrowRightIcon } from 'shared-frontend/icons/OtherIcons/ArrowRightIcon';

// types
import { EditTemplateDescriptionProps } from '@components/TemplateManagement/EditTemplateDescription/types';

// stores
import { getRandomHexColor } from 'shared-utils';
import { useRouter } from 'next/router';
import {
    $profileStore,
    $businessCategoriesStore,
    checkCustomLinkFx,
    getBusinessCategoriesFx,
} from '../../../store';

// const
import {
    MAX_DESCRIPTION_LENGTH,
    MAX_NAME_LENGTH,
} from '../../../const/templates/info';
import frontendConfig from '../../../const/config';

// styles
import styles from './EditTemplateDescription.module.scss';

// utils
import { generateKeyByLabel } from '../../../utils/businessCategories/generateKeyByLabel';

const Component = ({
    onNextStep,
    onPreviousStep,
    template,
}: EditTemplateDescriptionProps) => {
    const router = useRouter();
    const businessCategories = useStore($businessCategoriesStore);
    const profileStore = useStore($profileStore);

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
    const tagsCustom = router.query.tags;
    const isCustom = !!tagsCustom;
    const nameErrorMessage: string = errors?.name?.[0]?.message || '';
    const descriptionErrorMessage: string =
        errors?.description?.[0]?.message || '';
    const aboutTheHostErrorMessage: string =
        errors?.aboutTheHost?.[0]?.message || '';
    const tagsErrorMessage: string = errors?.tags?.[0]?.message || '';
    const customLinkErrorMessage: string =
        errors?.customLink?.[0]?.message || '';
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [ enableMonetization, setEnableMonetization ] = useState(false);

    useEffect(() => {
        (() => {
            getBusinessCategoriesFx({});
        })();
    }, []);

    useEffect(() => {
        trigger('tags');

        if (isCustom) {
            const tagCustom = businessCategories.list.find(
                item => item.id === tagsCustom,
            );
            setValue('tags', [
                {
                    ...tagCustom,
                    label: tagCustom?.value ?? '',
                },
            ]);
            return;
        }

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
    }, []);



    const handleClickNextStep = useCallback(async () => {
        const response = await trigger([
            'name',
            'description',
            'tags',
            'customLink',
        ]);

        if (customLink) {
            const isBusy = await checkCustomLinkFx({
                templateId: template?.id,
                customLink,
            });

            if (isBusy) {
                setError('customLink', [
                    {
                        type: 'focus',
                        message: 'meeting.settings.customLink.busy',
                    },
                ]);
                return;
            }
        }

        clearErrors('customLink');

        if (response) {
            onNextStep();
        }
    }, [onNextStep, customLink, template?.id]);

    const { onChange: onChangeName, ...nameProps } = useMemo(
        () => register('name'),
        [],
    );
    const customLinkProps = useMemo(() => register('customLink'), []);
    const { onChange: onChangeDescription, ...descriptionProps } = useMemo(
        () => register('description', { required: false }),
        [],
    );

    const { onChange: onChangeAboutTheHost, ...aboutTheHost } = useMemo(
        () => register('aboutTheHost', { required: false }),
        [],
    );

    const handleChangeDescription = useCallback(event => {
        if (event.target.value.length > MAX_DESCRIPTION_LENGTH) {
            // eslint-disable-next-line no-param-reassign
            event.target.value = event.target.value.slice(
                0,
                MAX_DESCRIPTION_LENGTH,
            );
            setError('description', [
                {
                    type: 'focus',
                    message: `maxLength.${MAX_DESCRIPTION_LENGTH}`,
                },
            ]);
        } else {
            setError('description', [{ message: '', type: 'focus' }]);
        }
        onChangeDescription(event);
    }, []);

    const handleChangeAboutTheHost = useCallback(event => {
        if (event.target.value.length > MAX_DESCRIPTION_LENGTH) {
            // eslint-disable-next-line no-param-reassign
            event.target.value = event.target.value.slice(
                0,
                MAX_DESCRIPTION_LENGTH,
            );
            setError('aboutTheHost', [
                {
                    type: 'focus',
                    message: `maxLength.${MAX_DESCRIPTION_LENGTH}`,
                },
            ]);
        } else {
            setError('aboutTheHost', [{ message: '', type: 'focus' }]);
        }
        onChangeAboutTheHost(event);
    }, []);

    const handleChangeName = useCallback(event => {
        if (event.target.value.length > MAX_NAME_LENGTH) {
            // eslint-disable-next-line no-param-reassign
            event.target.value = event.target.value.slice(0, MAX_NAME_LENGTH);
            setError('name', [
                { type: 'focus', message: `maxLength.${MAX_NAME_LENGTH}` },
            ]);
        } else {
            setError('name', [{ message: '', type: 'focus' }]);
        }
        onChangeName(event);
    }, []);

    const customLinkInputProps = useMemo(
        () => ({
            startAdornment: <CustomLinkIcon width="24px" height="24px" />,
        }),
        [],
    );

    const businessCategoriesOptions = useMemo(
        () =>
            businessCategories.list.map(item => ({
                ...item,
                label: item.value,
            })),
        [businessCategories.list],
    );

    const toggleSelected = (e: MouseEvent<HTMLElement>) => {
        setEnableMonetization(prev => !prev);

        if (enableMonetization) {
            setAnchorEl(e.currentTarget);
        }
    };

    const handleCloseButton = () => {
        setAnchorEl(null);
    };

    return (
        <CustomGrid
            container
            alignItems="center"
            justifyContent="flex-start"
            className={styles.wrapper}
        >
            <CustomPopover
                id="monetization"
                open={Boolean(anchorEl)}
                onClose={handleCloseButton}
                anchorEl={anchorEl}
                style={{ zIndex: 20 }}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 450,
                    horizontal: 'left',
                }}
                PaperProps={{
                    className: clsx(styles.popoverMonetization),
                }}
            >
                <CustomPaper
                    variant="black-glass"
                    className={styles.commonOpenPanel}
                >
                    <MeetingMonetization onUpdate={handleCloseButton} />
                </CustomPaper>
            </CustomPopover>
            <CustomPaper variant="black-glass" className={styles.paper}>
                <CustomGrid container direction="column">
                    <CustomTypography
                        variant="body1bold"
                        color="colors.white.primary"
                        nameSpace="createRoom"
                        translation="editDescription.form.roomName"
                        className={clsx(styles.label)}
                    />
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
                        </CustomGrid>
                    </CustomGrid>
                    <CustomGrid
                        container
                        justifyContent="space-between"
                        className={styles.label}
                    >
                        <CustomTypography
                            variant="body3"
                            color="colors.white.primary"
                            nameSpace="createRoom"
                            translation="editDescription.form.description"
                        />
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
                    <CustomGrid
                        container
                        justifyContent="space-between"
                        className={styles.label}
                    >
                        <CustomTypography
                            variant="body3"
                            color="colors.white.primary"
                            nameSpace="createRoom"
                            translation="editDescription.form.aboutTheHost"
                        />
                        <CustomTypography
                            variant="body3"
                            color="colors.white.primary"
                        >
                            {`${description.length}/${MAX_DESCRIPTION_LENGTH}`}
                        </CustomTypography>
                    </CustomGrid>
                    <CustomInput
                        defaultValue= { profileStore.description }
                        color="secondary"
                        autoComplete="off"
                        onChange={handleChangeAboutTheHost}
                        error={aboutTheHostErrorMessage}
                        multiline
                        rows={3}
                        {...aboutTheHost}
                    />
                </CustomGrid>
            </CustomPaper>
            <CustomPaper variant="black-glass" className={styles.monetizationPanel}>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <CustomGrid item md={8} xs={7}>
                        <CustomTypography
                            variant="body2"
                            color="colors.white.primary"
                            nameSpace="createRoom"
                            translation="editDescription.form.monetizationTitle"
                        />
                        <CustomTypography
                            variant="body3"
                            color="colors.white.primary"
                            nameSpace="createRoom"
                            translation="editDescription.form.monetizationContent"
                            className={styles.monetizationContent}
                        />
                    </CustomGrid>
                    <CustomGrid item md={4} xs={5} container direction="row" justifyContent="flex-end" alignItems="center">
                        <div className={styles.customSwitchContainer} onClick={toggleSelected}>
                            <div className={clsx(styles.dialogButton, { [styles.disabledButton]: enableMonetization })} />
                        </div>
                        {enableMonetization
                            ? <CustomTypography
                                variant="body2"
                                color="colors.white.primary"
                                nameSpace="createRoom"
                                translation="editDescription.form.monetizationContentOn"
                                className={styles.monetizationContentToggleValue}
                            />
                            : <CustomTypography
                                variant="body2"
                                color="colors.white.primary"
                                nameSpace="createRoom"
                                translation="editDescription.form.monetizationContentOff"
                                className={styles.monetizationContentToggleValue}
                            />}
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
                    className={styles.actionButtonPrev}
                    onAction={onPreviousStep}
                />
                <ActionButton
                    variant="accept"
                    Icon={<ArrowRightIcon width="32px" height="32px" />}
                    className={styles.actionButtonNext}
                    onAction={handleClickNextStep}
                />
            </CustomGrid>
        </CustomGrid>
    );
};

export const EditTemplateDescription = memo(Component);
