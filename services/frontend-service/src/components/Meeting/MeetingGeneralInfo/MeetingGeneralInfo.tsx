import { memo, useRef, SyntheticEvent } from 'react';
import { useStore } from 'effector-react';
import { useFormContext, useWatch } from 'react-hook-form';
import clsx from 'clsx';
import { Fade } from '@mui/material';

// hooks
import { useToggle } from '@hooks/useToggle';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// icons
import { EditIcon } from 'shared-frontend/icons/OtherIcons/EditIcon';
import { InfoIcon } from 'shared-frontend/icons/OtherIcons/InfoIcon';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// styles
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';
import { Translation } from '@library/common/Translation/Translation';
import styles from './MeetingGeneralInfo.module.scss';

// store
import {
    $isOwner,
    toggleMeetingInfoOpen,
    $meetingTemplateStore,
    $meetingEmojiListVisibilityStore,
    $isToggleUsersPanel,
    $isToggleSchedulePanel,
    $isToggleEditRuumePanel,
    toggleProfilePanelEvent,
    setEmojiListVisibilityEvent,
    toggleUsersPanelEvent,
    toggleSchedulePanelEvent,
    toggleEditRuumeSettingEvent
} from '../../../store/roomStores';

const Component = () => {
    const isOwner = useStore($isOwner);
    const meetingTemplate = useStore($meetingTemplateStore);
    const { isEmojiListVisible } = useStore($meetingEmojiListVisibilityStore);
    const isUsersOpen = useStore($isToggleUsersPanel);
    const isSchedulePannelOpen = useStore($isToggleSchedulePanel);
    const isEditRuumeSettingPanelOpen = useStore($isToggleEditRuumePanel);

    const wrapperRef = useRef(null);

    const {
        value: isMeetingActionOpened,
        onToggleSwitch: handleToggleAvatarAction,
    } = useToggle(false);

    const { control } = useFormContext();

    const fullName = useWatch({
        control,
        name: 'fullName',
    });

    const handleMeetingAction = (e: SyntheticEvent) => {
        e.stopPropagation();
        if (isOwner) {
            toggleProfilePanelEvent();
            // toggleEditTemplateOpen();
            if (isEmojiListVisible) {
                setEmojiListVisibilityEvent({ isEmojiListVisible: false });
            }

            if (isUsersOpen) {
                toggleUsersPanelEvent(false);
            }

            if (isSchedulePannelOpen) {
                toggleSchedulePanelEvent(false);
            }

            if (isEditRuumeSettingPanelOpen) {
                toggleEditRuumeSettingEvent(false);
            }
        } else {
            toggleMeetingInfoOpen();
        }
    }

    return (
        <CustomGrid
            item
            container
            ref={wrapperRef}
            className={clsx(styles.profileInfo)}
        >
            <CustomGrid
                item
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
            >
                <CustomTooltip
                    title={
                        <Translation
                            nameSpace="meeting"
                            translation="meetingInfo.tooltip"
                        />
                    }
                    placement="top"
                >
                    <CustomBox
                        onMouseEnter={handleToggleAvatarAction}
                        onMouseLeave={handleToggleAvatarAction}
                        className={styles.profileAvatar}
                    >
                        <ProfileAvatar
                            src={meetingTemplate?.user?.profileAvatar?.url}
                            width="45px"
                            height="45px"
                            userName={
                                isOwner ? fullName : meetingTemplate.fullName
                            }
                            isAcceptNoLogin={meetingTemplate.isAcceptNoLogin}
                        />

                        <Fade in={isMeetingActionOpened}>
                            <CustomGrid
                                onClick={handleMeetingAction}
                                className={styles.meetingActionWrapper}
                                container
                                justifyContent="center"
                                alignItems="center"
                            >
                                {isOwner ? (
                                    <EditIcon width="36px" height="36px" />
                                ) : (
                                    <InfoIcon width="36px" height="36px" />
                                )}
                            </CustomGrid>
                        </Fade>
                    </CustomBox>
                </CustomTooltip>
            </CustomGrid>
        </CustomGrid>
    );
};

export const MeetingGeneralInfo = memo(Component);
