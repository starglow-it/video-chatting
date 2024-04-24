import { memo, useEffect, useState, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useStore } from 'effector-react';
import clsx from 'clsx';

import { useNavigation } from '@hooks/useNavigation';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomAutocomplete } from 'shared-frontend/library/custom/CustomAutocomplete';
import { IBusinessCategory } from 'shared-types';
import { AutocompleteType } from 'shared-frontend/types';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomLinkIcon } from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChalkboardUser, faFolderClosed, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { addNotificationEvent } from 'src/store';
import { NotificationType } from 'src/store/types';

// components
import { EditPrivacyProps } from '@components/TemplateManagement/EditPrivacy/types';

// icons
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';
import { LockIcon } from 'shared-frontend/icons/OtherIcons/LockIcon';
import { PeopleIcon } from 'shared-frontend/icons/OtherIcons/PeopleIcon';

// const
import { Translation } from '@library/common/Translation/Translation';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { ErrorMessage } from 'shared-frontend/library/common/ErrorMessage';

// store
import { useRouter } from 'next/router';
import { $businessCategoriesStore } from '../../../store';

// styles
import styles from './EditPrivacy.module.scss';

const options = [
    {
        id: '1',
        value: 'private',
        translationKey: 'editPrivacy.private',
        Icon: LockIcon,
        availableWithTrial: true,
        withUpgradeButton: false,
    },
    {
        id: '2',
        value: 'public',
        translationKey: 'editPrivacy.public',
        Icon: PeopleIcon,
        availableWithTrial: false,
        withUpgradeButton: true,
    },
];

const Component = ({
    onSubmit,
    handleEnterMeeting,
    handleScheduleMeeting,
    onPreviousStep,
}: EditPrivacyProps) => {
    const router = useRouter();
    const isCustom = !!router.query.tags;
    const businessCategories = useStore($businessCategoriesStore);
    const { isMobile } = useBrowserDetect();
    const [customUrl, setCustomUrl] = useState('');

    const { control, register, setValue, watch, formState: { errors } } = useFormContext();

    const { onChange } = useNavigation({ tabs: options });
    const tagsErrorMessage: string = errors?.tags?.[0]?.message || '';
    const customLinkInputProps = useMemo(
        () => ({
            startAdornment: <CustomLinkIcon width="24px" height="24px" />,
        }),
        [],
    );
    const customLinkErrorMessage: string =
        errors?.customLink?.[0]?.message || '';
    const customLinkProps = useMemo(() => register('customLink'), []);
    const customLinkValue = watch('customLink');

    useEffect(() => {
        const isPublic = watch('isPublic');
        if (isPublic) {
            onChange(options[1].value);
        }
    }, [watch]);

    useEffect(() => {
        if (!!customLinkValue) {
            const domain = new URL(window.location.href);
            setCustomUrl(`${domain.origin}/room/${customLinkValue}`);
        } else {
            setCustomUrl('');
        }
    }, [customLinkValue]);

    useEffect(() => {
        if (isCustom) {
            onChange(options[1].value);
            setValue('isPublic', true);
        }
    }, []);

    const businessCategoriesOptions = useMemo(
        () =>
            businessCategories.list.map(item => ({
                ...item,
                label: item.value,
            })),
        [businessCategories.list],
    );

    const handleCustomLinkCopy = () => {
        navigator.clipboard.writeText(customUrl);
        addNotificationEvent({
            type: NotificationType.LinkInfoCopied,
            message: "Url copied.",
        });
    };

    return (
        <CustomGrid
            container
            alignItems="center"
            justifyContent="center"
            direction="column"
            className={styles.wrapper}
        >
            <CustomPaper variant="black-glass" className={clsx(styles.paper, { [styles.mobile]: isMobile })}>
                <CustomGrid container direction="column">
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
                        <ConditionalRender condition={!!customUrl}>
                            <CustomGrid>
                                <CustomTypography variant="body3" color="colors.white.primary">
                                    {customUrl}
                                </CustomTypography>
                                <CustomTooltip
                                    nameSpace="createRoom"
                                    translation="urlCopy"
                                    placement="right"
                                >
                                    <IconButton aria-label="copy-link" size="small" sx={{ color: "white" }} onClick={handleCustomLinkCopy}>
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                </CustomTooltip>
                            </CustomGrid>
                        </ConditionalRender>
                    </CustomGrid>
                    <CustomInput
                        autoComplete="off"
                        color="secondary"
                        InputProps={customLinkInputProps}
                        error={customLinkErrorMessage}
                        {...customLinkProps}
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
                        classes={{
                            inputRoot: isCustom
                                ? styles.disabledTags
                                : undefined,
                        }}
                        name="tags"
                        autoComplete
                        disabled={isCustom}
                        error={tagsErrorMessage}
                        errorComponent={
                            <ConditionalRender
                                condition={Boolean(tagsErrorMessage)}
                            >
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
            </CustomPaper>
            <CustomPaper variant="black-glass" className={clsx(styles.eventPaper, { [styles.mobile]: isMobile })}>
                <CustomGrid
                    container
                    alignItems="center"
                    justifyContent="space-around"
                >
                    <CustomGrid item xs container alignItems="center" justifyContent="center" direction="column">

                        {
                            !isMobile
                                ? <>
                                    <CustomTypography className={styles.eventIconWrapper}>
                                        <FontAwesomeIcon icon={faFolderClosed} className={styles.eventIcon} />
                                    </CustomTypography>
                                    <CustomTooltip
                                        nameSpace="createRoom"
                                        translation="editPrivacy.eventBtns.tooltips.saveRuume"
                                        placement="bottom"
                                    >
                                        <CustomButton
                                            label={
                                                <Translation
                                                    nameSpace="createRoom"
                                                    translation="editPrivacy.eventBtns.buttons.saveRuume"
                                                />
                                            }
                                            onClick={onSubmit}
                                            className={styles.eventBtn}
                                        />
                                    </CustomTooltip>
                                </>
                                : <IconButton style={{ color: 'white' }} aria-label="add an alarm" onClick={onSubmit}>
                                    <FontAwesomeIcon icon={faFolderClosed} className={styles.eventIcon} />
                                </IconButton>

                        }
                    </CustomGrid>
                    <CustomGrid item xs container alignItems="center" justifyContent="center" direction="column">

                        {
                            !isMobile
                                ? <>
                                    <CustomTypography className={styles.eventIconWrapper}>
                                        <FontAwesomeIcon icon={faChalkboardUser} className={styles.eventIcon} />
                                    </CustomTypography>
                                    <CustomTooltip
                                        nameSpace="createRoom"
                                        translation="editPrivacy.eventBtns.tooltips.enter"
                                        placement="bottom"
                                    >
                                        <CustomButton
                                            label={
                                                <Translation
                                                    nameSpace="createRoom"
                                                    translation="editPrivacy.eventBtns.buttons.enter"
                                                />
                                            }
                                            onClick={handleEnterMeeting}
                                            className={styles.eventBtn}
                                        />
                                    </CustomTooltip>
                                </>
                                : <IconButton style={{ color: 'white' }} aria-label="add an alarm" onClick={handleEnterMeeting}>
                                    <FontAwesomeIcon icon={faChalkboardUser} className={styles.eventIcon} />
                                </IconButton>
                        }
                    </CustomGrid>
                    <CustomGrid item xs container alignItems="center" justifyContent="center" direction="column">

                        {
                            !isMobile
                                ? <>
                                    <CustomTypography className={styles.eventIconWrapper}>
                                        <FontAwesomeIcon icon={faCalendarDays} className={styles.eventIcon} />
                                    </CustomTypography>
                                    <CustomTooltip
                                        nameSpace="createRoom"
                                        translation="editPrivacy.eventBtns.tooltips.schedule"
                                        placement="bottom"
                                    >
                                        <CustomButton
                                            label={
                                                <Translation
                                                    nameSpace="createRoom"
                                                    translation="editPrivacy.eventBtns.buttons.schedule"
                                                />
                                            }
                                            onClick={handleScheduleMeeting}
                                            className={styles.eventBtn}
                                        />
                                    </CustomTooltip>
                                </>
                                : <IconButton style={{ color: 'white' }} aria-label="add an alarm" onClick={handleScheduleMeeting}>
                                    <FontAwesomeIcon icon={faCalendarDays} className={styles.eventIcon} />
                                </IconButton>
                        }
                    </CustomGrid>
                </CustomGrid>
            </CustomPaper>
            <CustomGrid
                container
                gap={3}
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
            </CustomGrid>
        </CustomGrid >
    );
};

export const EditPrivacy = memo(Component);
