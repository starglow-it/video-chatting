import { memo, useCallback, useRef } from 'react';
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
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// styles
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';
import { Translation } from '@library/common/Translation/Translation';
import styles from './MeetingGeneralInfo.module.scss';

// store
import {
    $isOwner,
    toggleEditTemplateOpen,
    toggleMeetingInfoOpen,
    $meetingTemplateStore,
} from '../../../store/roomStores';

const Component = () => {
    const isOwner = useStore($isOwner);
    const meetingTemplate = useStore($meetingTemplateStore);

    const wrapperRef = useRef(null);

    const {
        value: isMeetingActionOpened,
        onToggleSwitch: handleToggleAvatarAction,
    } = useToggle(false);

    const { control } = useFormContext();

    const companyName = useWatch({
        control,
        name: 'companyName',
    });

    const fullName = useWatch({
        control,
        name: 'fullName',
    });

    const handleMeetingAction = useCallback(() => {
        if (isOwner) {
            toggleEditTemplateOpen();
        } else {
            toggleMeetingInfoOpen();
        }
    }, []);

    return (
        <CustomGrid
            container
            ref={wrapperRef}
            className={clsx(styles.profileInfo)}
        >
            <CustomGrid
                gap={1}
                container
                className={styles.info}
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
                    placement="right"
                >
                    <CustomBox
                        onMouseEnter={handleToggleAvatarAction}
                        onMouseLeave={handleToggleAvatarAction}
                        className={styles.profileAvatar}
                    >
                        <ProfileAvatar
                            src={meetingTemplate?.user?.profileAvatar?.url}
                            width="60px"
                            height="60px"
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

                <CustomGrid
                    container
                    direction="column"
                    alignItems="flex-start"
                    className={styles.companyName}
                >
                    <CustomTypography
                        color="colors.white.primary"
                        className={clsx(
                            styles.companyNameTitle,
                            styles.withoutBoard,
                        )}
                    >
                        {isOwner ? companyName : meetingTemplate.companyName}
                    </CustomTypography>
                </CustomGrid>
            </CustomGrid>
        </CustomGrid>
    );
};

export const MeetingGeneralInfo = memo(Component);
