import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useStore } from 'effector-react';
import { useFormContext, useWatch } from 'react-hook-form';
import clsx from 'clsx';
import { Fade } from '@mui/material';

// hooks
import { useToggle } from '@hooks/useToggle';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';

// common
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// icons
import { EditIcon } from 'shared-frontend/icons/OtherIcons/EditIcon';
import { InfoIcon } from 'shared-frontend/icons/OtherIcons/InfoIcon';
import { RoundErrorIcon } from 'shared-frontend/icons/RoundIcons/RoundErrorIcon';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomPopper } from '@library/custom/CustomPopper/CustomPopper';

// shared
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

// styles
import styles from './MeetingGeneralInfo.module.scss';

// store
import {
    $isOwner,
    toggleEditTemplateOpen,
    toggleMeetingInfoOpen,
    $meetingTemplateStore,
} from '../../../store/roomStores';
import { SIGN_BOARDS } from '../../../const/signBoards';

const Component = () => {
    const isOwner = useStore($isOwner);
    const meetingTemplate = useStore($meetingTemplateStore);

    const wrapperRef = useRef(null);

    const {
        value: isMeetingActionNoteOpened,
        onSwitchOn: handleOpenMeetingActionNote,
        onSwitchOff: handleCloseMeetingActionNote,
    } = useToggle(false);

    const { value: isMeetingActionOpened, onToggleSwitch: handleToggleAvatarAction } =
        useToggle(false);

    const { control } = useFormContext();

    const signBoard = useWatch({
        control,
        name: 'signBoard',
    });

    const { isMobile } = useBrowserDetect();

    const targetSignBoardKey = isOwner ? signBoard : meetingTemplate.signBoard;

    const isThereSignBoard = !isMobile && targetSignBoardKey && targetSignBoardKey !== 'default';

    const companyName = useWatch({
        control,
        name: 'companyName',
    });

    const fullName = useWatch({
        control,
        name: 'fullName',
    });

    useEffect(() => {
        setTimeout(() => {
            handleOpenMeetingActionNote();
            setTimeout(() => {
                handleCloseMeetingActionNote();
            }, 5000);
        }, 2000);
    }, []);

    const handleMeetingAction = useCallback(() => {
        if (isOwner) {
            toggleEditTemplateOpen();
        } else {
            toggleMeetingInfoOpen();
        }
    }, []);

    const targetSignBoard = useMemo(
        () =>
            SIGN_BOARDS.find(signs =>
                signs.find(board => board.value === targetSignBoardKey),
            )?.find(board => board.value === targetSignBoardKey),
        [targetSignBoardKey],
    );

    return (
        <CustomGrid
            container
            ref={wrapperRef}
            className={clsx(styles.profileInfo, { [styles.withBoard]: isThereSignBoard })}
        >
            <ConditionalRender condition={isThereSignBoard}>
                <CustomImage
                    src={`/images/boards/${targetSignBoard?.type}/${targetSignBoard?.value}.png`}
                    width="360px"
                    height="244px"
                />
            </ConditionalRender>
            <CustomGrid
                gap={1}
                container
                className={styles.info}
                direction={isThereSignBoard ? 'column' : 'row'}
                justifyContent={isThereSignBoard ? 'center' : 'flex-start'}
                alignItems="center"
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
                        userName={isOwner ? fullName : meetingTemplate.fullName}
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

                <CustomGrid
                    container
                    direction="column"
                    alignItems={isThereSignBoard ? 'center' : 'flex-start'}
                    className={styles.companyName}
                >
                    <CustomTypography
                        color="colors.white.primary"
                        className={clsx(styles.companyNameTitle, {
                            [styles.withBoard]: isThereSignBoard,
                            [styles.withoutBoard]: !isThereSignBoard,
                        })}
                    >
                        {isOwner ? companyName : meetingTemplate.companyName}
                    </CustomTypography>
                </CustomGrid>
            </CustomGrid>
            <CustomPopper
                id="meetingActionNote"
                open={isMeetingActionNoteOpened}
                placement={isThereSignBoard ? 'bottom' : 'bottom-start'}
                anchorEl={wrapperRef.current}
            >
                <CustomGrid
                    container
                    alignItems="center"
                    gap={1}
                    className={clsx(styles.meetingActionNote, {
                        [styles.withBoard]: isThereSignBoard,
                    })}
                >
                    <CustomTypography
                        nameSpace="meeting"
                        variant="body2"
                        color="colors.white.primary"
                        translation={`meetingActions.${isOwner ? 'editTemplate' : 'meetingInfo'}`}
                    />
                    <RoundErrorIcon
                        className={styles.closeIcon}
                        width="16px"
                        height="16px"
                        onClick={handleCloseMeetingActionNote}
                    />
                </CustomGrid>
            </CustomPopper>
        </CustomGrid>
    );
};

export const MeetingGeneralInfo = memo(Component);
