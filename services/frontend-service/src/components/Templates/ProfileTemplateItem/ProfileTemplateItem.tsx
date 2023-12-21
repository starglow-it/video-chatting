import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Fade, Menu, MenuItem } from '@mui/material';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import { useRouter } from 'next/router';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { EllipsisIcon } from 'shared-frontend/icons/OtherIcons/EllipsisIcon';
import { DeleteIcon } from 'shared-frontend/icons/OtherIcons/DeleteIcon';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { useToggle } from 'shared-frontend/hooks/useToggle';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

// common
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { Translation } from '@library/common/Translation/Translation';

// components
import { TemplateMainInfo } from '@components/Templates/TemplateMainInfo/TemplateMainInfo';
import { TemplateInfo } from '@components/Templates/TemplateInfo/TemplateInfo';

// stores
import { CustomVideoPlayer } from 'shared-frontend/library/custom/CustomVideoPlayer';
import {
    $isBusinessSubscription,
    $isProfessionalSubscription,
    $profileStore,
    appDialogsApi,
    setDeleteTemplateIdEvent,
    setScheduleTemplateEvent,
} from '../../../store';

// const
import { editRoomRoute } from '../../../const/client-routes';

// styles
import styles from './ProfileTemplateItem.module.scss';

// types
import { ProfileTemplateProps } from './types';
import { AppDialogsEnum } from '../../../store/types';

const ProfileTemplateItem = memo(
    ({ template, onChooseTemplate }: ProfileTemplateProps) => {
        const profile = useStore($profileStore);
        const isBusinessSubscription = useStore($isBusinessSubscription);
        const isProfSubscription = useStore($isProfessionalSubscription);

        const isHouseSubscription =
            !isBusinessSubscription && !isProfSubscription;

        const [showPreview, setShowPreview] = useState(false);
        const actionButtonRef = useRef<HTMLButtonElement | null>(null);

        const {
            value: isMenuOpen,
            onSwitchOn: onShowMenu,
            onSwitchOff: onHideMenu,
        } = useToggle(false);

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
            setScheduleTemplateEvent({
                id: template.customLink || template.id,
                isPublishAudience: template.isPublishAudience,
            });

            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.scheduleMeetingDialog,
            });
        }, [template]);

        const handleEditMeeting = useCallback(() => {
            if (!isHouseSubscription) {
                router.push(
                    `${editRoomRoute}/${template.customLink || template.id}`,
                );
            }
        }, [isHouseSubscription]);

        const previewImage = (template?.previewUrls || []).find(
            preview => preview.resolution === 240,
        );

        const renderPreview = () => {
            if (template?.mediaLink) {
                return (
                    <CustomImage
                        src={template?.mediaLink?.thumb || ''}
                        width="334px"
                        height="190px"
                    />
                );
            }
            switch (template?.templateType) {
                case 'image':
                    return (
                        <CustomImage
                            src={template?.url || ''}
                            width="334px"
                            height="190px"
                        />
                    );
                case 'video':
                    return (
                        <CustomGrid width="334px" height="190px">
                            <CustomVideoPlayer
                                src={template?.url || ''}
                                volume={0}
                                isPlaying
                                isMuted
                            />
                        </CustomGrid>
                    );
                default:
                    return null;
            }
        };

        return (
            <CustomGrid
                className={styles.templateContent}
                container
                justifyContent="center"
                alignItems="center"
                onMouseEnter={handleShowPreview}
                onMouseLeave={handleHidePreview}
            >
                <ConditionalRender
                    condition={!!template?.mediaLink || !!previewImage?.url}
                >
                    {renderPreview()}
                </ConditionalRender>
                <TemplateMainInfo
                    show={!showPreview}
                    name={template.name}
                    description={template.description}
                    maxParticipants={template.maxParticipants}
                    isNeedToShowBusinessInfo
                    isPublic={template.isPublic}
                    isCommonTemplate={
                        profile.id ? profile.id !== template.author : true
                    }
                    authorRole={template.authorRole}
                    authorThumbnail={template.authorThumbnail}
                    authorName={template.authorName}
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
                            isCommonTemplate={
                                profile.id
                                    ? profile.id !== template.author
                                    : true
                            }
                        />
                        <CustomGrid container wrap="nowrap" gap={1.5}>
                            <CustomButton
                                onClick={handleCreateMeeting}
                                className={styles.startMeetingBtn}
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
                                    <Translation
                                        nameSpace="templates"
                                        translation="buttons.schedule"
                                    />
                                }
                                typographyProps={{
                                    variant: 'body2',
                                }}
                            />
                        </CustomGrid>
                        <ConditionalRender condition={template.type !== 'paid'}>
                            {template.author !== profile.id ? (
                                <ActionButton
                                    variant="transparent"
                                    onAction={handleOpenDeleteDialog}
                                    className={styles.deleteBtn}
                                    Icon={
                                        <DeleteIcon
                                            width="22px"
                                            height="22px"
                                        />
                                    }
                                />
                            ) : (
                                <ActionButton
                                    ref={actionButtonRef}
                                    variant="transparent"
                                    onAction={onShowMenu}
                                    className={styles.menuButton}
                                    Icon={
                                        <EllipsisIcon
                                            width="20px"
                                            height="20px"
                                        />
                                    }
                                />
                            )}
                        </ConditionalRender>
                        <Menu
                            open={isMenuOpen}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            anchorEl={actionButtonRef?.current}
                            classes={{ paper: styles.menu }}
                            onClose={onHideMenu}
                        >
                            <CustomTooltip
                                arrow
                                title={
                                    isHouseSubscription ? (
                                        <CustomTypography
                                            variant="body3"
                                            nameSpace="templates"
                                            translation="editTemplateDisabled"
                                        />
                                    ) : null
                                }
                                placement="bottom"
                                tooltipClassName={styles.tooltip}
                                popperClassName={styles.popper}
                            >
                                <MenuItem
                                    onClick={handleEditMeeting}
                                    className={clsx(styles.item, {
                                        [styles.disabled]: isHouseSubscription,
                                    })}
                                >
                                    <CustomTypography
                                        nameSpace="templates"
                                        translation="buttons.edit"
                                    />
                                </MenuItem>
                            </CustomTooltip>
                            <MenuItem
                                onClick={handleOpenDeleteDialog}
                                className={styles.item}
                            >
                                <CustomTypography
                                    nameSpace="templates"
                                    translation="buttons.delete"
                                />
                            </MenuItem>
                        </Menu>
                    </CustomGrid>
                </Fade>
            </CustomGrid>
        );
    },
);

export { ProfileTemplateItem };
