import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Fade, Menu, MenuItem } from '@mui/material';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import { useRouter } from 'next/router';

// custom
import { CustomGrid } from 'shared-frontend/library';
import { CustomButton } from 'shared-frontend/library';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// icon
import { EllipsisIcon } from 'shared-frontend/icons';
import { DeleteIcon } from 'shared-frontend/icons';

// common
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { TemplateMainInfo } from '@components/Templates/TemplateMainInfo/TemplateMainInfo';
import { TemplateInfo } from '@components/Templates/TemplateInfo/TemplateInfo';

// hooks
import { useToggle } from '@hooks/useToggle';

// stores
import { CustomImage } from 'shared-frontend/library';
import { Translation } from '@library/common/Translation/Translation';
import {
    $isBusinessSubscription,
    $profileStore,
    addNotificationEvent,
    appDialogsApi,
    setDeleteTemplateIdEvent,
    setScheduleTemplateIdEvent,
} from '../../../store';

// const
import { editRoomRoute } from '../../../const/client-routes';

// shared

// styles
import styles from './ProfileTemplateItem.module.scss';

// types
import { ProfileTemplateProps } from './types';
import { AppDialogsEnum, NotificationType } from '../../../store/types';

const ProfileTemplateItem = memo(({ template, onChooseTemplate }: ProfileTemplateProps) => {
    const profile = useStore($profileStore);
    const isBusinessSubscription = useStore($isBusinessSubscription);

    const isDisabled = profile.maxMeetingTime === 0 && !isBusinessSubscription;

    const [showPreview, setShowPreview] = useState(false);
    const actionButtonRef = useRef<HTMLButtonElement | null>(null);

    const { value: isMenuOpen, onSwitchOn: onShowMenu, onSwitchOff: onHideMenu } = useToggle(false);

    const router = useRouter();

    useEffect(() => {
        if (!showPreview) {
            onHideMenu();
        }
    }, [showPreview]);

    const handleShowPreview = useCallback(() => {
        setShowPreview(true);
    }, []);

    const handleHidePreview = useCallback(() => {
        setShowPreview(false);
    }, []);

    const handleCreateMeeting = useCallback(async () => {
        onChooseTemplate?.(template.id);
    }, []);

    const handleOpenDeleteDialog = useCallback(() => {
        setDeleteTemplateIdEvent(template.id);

        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.deleteTemplateDialog,
        });
    }, [template.id]);

    const handleScheduleMeeting = useCallback(() => {
        setScheduleTemplateIdEvent(template.id);

        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.scheduleMeetingDialog,
        });
    }, []);

    const handleEditMeeting = useCallback(() => {
        router.push(`${editRoomRoute}/${template.customLink || template.id}`);
    }, []);

    const previewImage = (template?.previewUrls || []).find(preview => preview.resolution === 240);

    const handleShowToast = useCallback(() => {
        addNotificationEvent({
            type: NotificationType.NoTimeLeft,
            message: `subscriptions.noTimeLeft`,
        });
    }, []);

    return (
        <CustomGrid
            className={styles.templateContent}
            container
            justifyContent="center"
            alignItems="center"
            onMouseEnter={handleShowPreview}
            onMouseLeave={handleHidePreview}
        >
            <ConditionalRender condition={Boolean(previewImage?.url)}>
                <CustomImage src={previewImage?.url || ''} width="334px" height="190px" />
            </ConditionalRender>
            <TemplateMainInfo
                show={!showPreview}
                name={template.name}
                description={template.description}
                maxParticipants={template.maxParticipants}
                isNeedToShowBusinessInfo
                isPublic={template.isPublic}
                isCommonTemplate={false}
            />
            <Fade in={showPreview}>
                <CustomGrid
                    container
                    direction="column"
                    justifyContent="space-between"
                    className={styles.templateMenu}
                >
                    <TemplateInfo
                        className={styles.avatar}
                        name={template.name}
                        description={template.description}
                        isPublic={template.isPublic}
                    />
                    <CustomGrid container wrap="nowrap" gap={1.5}>
                        <CustomButton
                            onMouseEnter={isDisabled ? handleShowToast : undefined}
                            onClick={!isDisabled ? handleCreateMeeting : undefined}
                            className={clsx(styles.startMeetingBtn, {
                                [styles.disabled]: isDisabled,
                            })}
                            disableRipple={isDisabled}
                            label={
                                <Translation
                                    nameSpace="templates"
                                    translation="buttons.startMeeting"
                                />
                            }
                            typographyProps={{
                                variant: 'body2',
                            }}
                        />
                        <CustomButton
                            variant="custom-transparent"
                            onClick={handleScheduleMeeting}
                            className={styles.startMeetingBtn}
                            label={
                                <Translation nameSpace="templates" translation="buttons.schedule" />
                            }
                            typographyProps={{
                                variant: 'body2',
                            }}
                        />
                    </CustomGrid>
                    <ConditionalRender condition={template.type !== 'paid'}>
                        {template.isPublic ? (
                            <ActionButton
                                variant="transparent"
                                onAction={handleOpenDeleteDialog}
                                className={styles.deleteBtn}
                                Icon={<DeleteIcon width="22px" height="22px" />}
                            />
                        ) : (
                            <ActionButton
                                ref={actionButtonRef}
                                variant="transparent"
                                onAction={onShowMenu}
                                className={styles.menuButton}
                                Icon={<EllipsisIcon width="20px" height="20px" />}
                            />
                        )}
                    </ConditionalRender>
                    <Menu
                        open={isMenuOpen}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        anchorEl={actionButtonRef?.current}
                        classes={{ paper: styles.menu }}
                        onClose={onHideMenu}
                    >
                        <MenuItem onClick={handleEditMeeting} className={styles.item}>
                            <CustomTypography nameSpace="templates" translation="buttons.edit" />
                        </MenuItem>
                        <MenuItem onClick={handleOpenDeleteDialog} className={styles.item}>
                            <CustomTypography nameSpace="templates" translation="buttons.delete" />
                        </MenuItem>
                    </Menu>
                </CustomGrid>
            </Fade>
        </CustomGrid>
    );
});

export { ProfileTemplateItem };
