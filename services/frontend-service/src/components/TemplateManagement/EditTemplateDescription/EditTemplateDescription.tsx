import { memo, useCallback, useState, useEffect, useMemo, useRef, MouseEvent } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useStore } from 'effector-react';
import clsx from 'clsx';

import { IBusinessCategory } from 'shared-types';
import { AutocompleteType } from 'shared-frontend/types';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { CustomPopover } from '@library/custom/CustomPopover/CustomPopover';
import { MeetingMonetization } from '../../Meeting/MeetingMonetization/MeetingMonetization';

//@mui
import Button from '@mui/material/Button';

// icons
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';
import { ArrowRightIcon } from 'shared-frontend/icons/OtherIcons/ArrowRightIcon';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

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

import { toggleCreateRoomPaymentFormEvent } from '../../../store/roomStores';

// const
import {
    MAX_DESCRIPTION_LENGTH,
    MAX_NAME_LENGTH,
} from '../../../const/templates/info';

// styles
import styles from './EditTemplateDescription.module.scss';

// utils
import { generateKeyByLabel } from '../../../utils/businessCategories/generateKeyByLabel';

//hooks
import useWindowSize from '@hooks/useWIndowSize';

const Component = ({
    onNextStep,
    onPreviousStep,
    template,
}: EditTemplateDescriptionProps) => {
    const router = useRouter();
    const businessCategories = useStore($businessCategoriesStore);
    const profileStore = useStore($profileStore);

    const { isMobile } = useBrowserDetect();

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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [enableMonetization, setEnableMonetization] = useState(false);
    const windowSize = useWindowSize();

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

    useEffect(() => {
        toggleCreateRoomPaymentFormEvent(enableMonetization);

        if (!enableMonetization) {
            setAnchorEl(null);
        }
    }, [enableMonetization]);

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

    const toggleSelected = (e: MouseEvent<HTMLElement>) => {
        setEnableMonetization(prev => !prev);

        if (!enableMonetization) {
            setAnchorEl(document.getElementById('formPanel'));
        }
    };

    const handleEditFees = () => {
        if (!enableMonetization) {
            setEnableMonetization(true);
            setAnchorEl(document.getElementById('formPanel'));
        }
    };

    const handleCloseButton = () => {
        setAnchorEl(null);
    };

    return (
        <CustomGrid
            item
            container
            alignItems="center"
            justifyContent="center"
            className={clsx(styles.wrapper)}
        >
            <CustomPopover
                id="monetization"
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                style={{ zIndex: 20, left: windowSize.width > 1500 && '20px', maxWidth: 'none' }}
                disableAutoFocus
                disablePortal
                onClose={() => { }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: windowSize.width > 1500 ? 'right' : 'center',
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: windowSize.width > 1500 ? 'left' : 'center',
                }}
                PaperProps={{
                    className: clsx(styles.popoverMonetization),
                }}
                className={clsx(styles.popover, { [styles.mobile]: isMobile })}
            >
                <CustomPaper
                    variant="black-glass"
                    className={styles.commonOpenPanel}
                >
                    <MeetingMonetization isRoomCreate={true} onUpdate={handleCloseButton} />
                </CustomPaper>
            </CustomPopover>
            <CustomPaper id="formPanel" variant="black-glass" className={clsx(styles.paper, { [styles.mobile]: isMobile })}>
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
                        defaultValue={profileStore.description}
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
            <CustomPaper variant="black-glass" className={clsx(styles.monetizationPanel, { [styles.mobile]: isMobile })}>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <CustomGrid item md={7} xs={7}>
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
                    <CustomGrid item md={5} xs={5} container direction="row" justifyContent="flex-end" alignItems="center">
                        <div className={styles.customSwitchContainer} onClick={toggleSelected}>
                            <div className={clsx(styles.dialogButton, { [styles.disabledButton]: !enableMonetization })} />
                        </div>
                        <CustomTypography
                            variant="body2"
                            color="colors.white.primary"
                            nameSpace="createRoom"
                            translation={enableMonetization ? "editDescription.form.monetizationContentOn" : "editDescription.form.monetizationContentOff"}
                            className={styles.monetizationContentToggleValue}
                        />
                        <Button
                            color="secondary"
                            aria-label="edit fees"
                            size="small"
                            startIcon={<MonetizationOnIcon style={{ fontSize: '2.5rem' }}/>}
                            className={styles.editFeesBtn}
                            onClick={handleEditFees}
                        >
                            edit fees
                        </Button>
                    </CustomGrid>
                </CustomGrid>
            </CustomPaper>
            <CustomGrid
                container
                gap={1.5}
                flexWrap="nowrap"
                justifyContent="center"
                className={clsx(styles.buttonsGroup, { [styles.mobile]: isMobile })}
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
