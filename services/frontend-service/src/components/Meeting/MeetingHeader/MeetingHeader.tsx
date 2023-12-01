import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { AppBar, Toolbar } from '@mui/material';
import clsx from 'clsx';
import { useStore } from 'effector-react';
import {
    $isOwner,
    $meetingStore,
    $meetingTemplateStore,
    toggleEditTemplateOpen,
    toggleLinksDrawerEvent,
    toggleMeetingInfoOpen,
    updateMeetingSocketEvent,
} from 'src/store/roomStores';

import { useFormContext, useWatch } from 'react-hook-form';
import { EditIcon } from 'shared-frontend/icons/OtherIcons/EditIcon';
import { InfoIcon } from 'shared-frontend/icons/OtherIcons/InfoIcon';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { useCallback } from 'react';
import { CustomLinkIcon } from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { LockIcon } from 'shared-frontend/icons/OtherIcons/LockIcon';
import { UnlockIcon } from 'shared-frontend/icons/OtherIcons/UnlockIcon';
import { addNotificationEvent } from 'src/store';
import { NotificationType } from 'src/store/types';
import styles from './MeetingHeader.module.scss';

export const MeetingHeader = () => {
    const meetingTemplate = useStore($meetingTemplateStore);
    const isOwner = useStore($isOwner);
    const { isBlockAudiences } = useStore($meetingStore);
    const { isAcceptNoLogin, subdomain } = useStore($meetingTemplateStore);

    const { control } = useFormContext();

    const companyName = useWatch({
        control,
        name: 'companyName',
    });

    const handleMeetingAction = useCallback(() => {
        if (isOwner) {
            toggleEditTemplateOpen();
        } else {
            toggleMeetingInfoOpen();
        }
    }, [isOwner]);

    const handleTogglePublicMeeting = () => {
        if (isAcceptNoLogin || subdomain) {
            addNotificationEvent({
                type: NotificationType.validationError,
                message: 'meeting.disablePublicMeeting',
            });
        } else {
            updateMeetingSocketEvent({
                isBlockAudiences: !isBlockAudiences,
            });
        }
    };

    return (
        <AppBar className={styles.container}>
            <Toolbar style={{ borderRadius: 0 }}>
                <ProfileAvatar
                    src={meetingTemplate?.user?.profileAvatar?.url}
                    width="45px"
                    height="45px"
                    userName={meetingTemplate.fullName}
                    isAcceptNoLogin={meetingTemplate.isAcceptNoLogin}
                />
                <CustomTypography
                    color="colors.black.primary"
                    className={clsx(
                        styles.companyNameTitle,
                        styles.withoutBoard,
                    )}
                    flex={1}
                    fontSize={13}
                    marginLeft={1}
                >
                    {isOwner ? companyName : meetingTemplate.companyName}
                </CustomTypography>

                <ConditionalRender condition={isOwner}>
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={10}
                        className={clsx(styles.button, {
                            [styles.link]: true,
                            [styles.inactive]: isBlockAudiences,
                        })}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={handleTogglePublicMeeting}
                            className={clsx(styles.button, {
                                [styles.inactive]: isBlockAudiences,
                            })}
                            Icon={
                                isBlockAudiences ? (
                                    <LockIcon width="22px" height="22px" />
                                ) : (
                                    <UnlockIcon width="18px" height="18px" />
                                )
                            }
                        />
                    </CustomPaper>
                </ConditionalRender>

                <ConditionalRender condition={!!meetingTemplate.links?.length}>
                    <CustomPaper
                        variant="black-glass"
                        borderRadius={10}
                        className={clsx(styles.button, { [styles.link]: true })}
                    >
                        <ActionButton
                            variant="transparentBlack"
                            onAction={() => toggleLinksDrawerEvent(true)}
                            className={clsx(styles.button)}
                            Icon={<CustomLinkIcon width="25px" height="25px" />}
                        />
                    </CustomPaper>
                </ConditionalRender>
                <CustomPaper
                    variant="black-glass"
                    borderRadius={10}
                    className={styles.button}
                >
                    <ActionButton
                        variant="transparentBlack"
                        onAction={handleMeetingAction}
                        className={clsx(styles.button, {
                            [styles.inactive]: true,
                        })}
                        Icon={
                            isOwner ? (
                                <EditIcon
                                    width="22px"
                                    height="22px"
                                    className={styles.icon}
                                />
                            ) : (
                                <InfoIcon
                                    width="22px"
                                    height="22px"
                                    className={styles.icon}
                                />
                            )
                        }
                    />
                </CustomPaper>
            </Toolbar>
        </AppBar>
    );
};
