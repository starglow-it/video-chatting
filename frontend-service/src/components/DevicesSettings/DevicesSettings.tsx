import React, { memo, useCallback, useContext, useEffect, useRef } from 'react';
import { useStore } from 'effector-react';
import { Divider } from '@mui/material';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';

// components
import { SelectDevices } from '@components/Media/SelectDevices/SelectDevices';
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';
import { MediaPreview } from '@components/Media/MediaPreview/MediaPreview';

// context
import { MediaContext } from '../../contexts/MediaContext';

// stores
import {
    $meetingStore,
    emitCancelEnterMeetingEvent,
    emitEnterMeetingEvent,
    emitStartMeetingEvent,
} from '../../store/meeting';
import { $localUserStore, updateLocalUserStateEvent } from '../../store/users';
import { addNotificationEvent } from '../../store/notifications';

// types
import { MeetingAccessStatuses, NotificationType } from '../../store/types';

// styles
import styles from './DevicesSettings.module.scss';

const DevicesSettings = memo(() => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const meeting = useStore($meetingStore);
    const user = useStore($localUserStore);

    const isOwner = meeting.ownerProfileId === user.profileId;

    const {
        data: {
            isStreamRequested,
            changeStream,
            error,
            isMicActive,
            isCameraActive,
            audioDevices,
            videoDevices,
        },
    } = useContext(MediaContext);

    useEffect(() => {
        if (changeStream && videoRef?.current) {
            videoRef.current.srcObject = changeStream;
        }
    }, [changeStream]);

    const handleToggleMic = useCallback(() => {
        if (changeStream) {
            addNotificationEvent({
                type: NotificationType.MicAction,
                data: { isMicActive: !isMicActive },
            });
            updateLocalUserStateEvent({
                micStatus: !isMicActive ? 'active' : 'inactive',
            });
        }
    }, [changeStream, isMicActive, error]);

    const handleToggleCamera = useCallback(() => {
        if (changeStream) {
            addNotificationEvent({
                type: NotificationType.CamAction,
                data: { isCameraActive: !isCameraActive },
            });
            updateLocalUserStateEvent({
                cameraStatus: !isCameraActive ? 'active' : 'inactive',
            });
        }
    }, [changeStream, isCameraActive, error]);

    const handleJoinMeeting = useCallback(async () => {
        if (!isStreamRequested) {
            if ((!changeStream && error === 'media.notAllowed') || (changeStream && !error)) {
                if (isOwner) {
                    emitStartMeetingEvent();
                } else {
                    emitEnterMeetingEvent();
                }
            } else {
                handleToggleCamera();
            }
        }
    }, [isOwner, changeStream, error, isStreamRequested]);

    const handleCancelRequest = useCallback(async () => {
        emitCancelEnterMeetingEvent();
    }, []);

    const isUserSentRequest = user.accessStatus === MeetingAccessStatuses.RequestSent;

    return (
        <CustomPaper className={styles.wrapper}>
            <CustomGrid container direction="column">
                <CustomGrid container wrap="nowrap" className={styles.settingsContent}>
                    <MediaPreview
                        onToggleAudio={handleToggleMic}
                        onToggleVideo={handleToggleCamera}
                    />
                    <Divider orientation="vertical" flexItem />
                    <CustomGrid
                        className={styles.devicesWrapper}
                        container
                        direction="column"
                        wrap="nowrap"
                    >
                        <CustomTypography
                            className={styles.title}
                            variant="h3bold"
                            nameSpace="meeting"
                            translation={isUserSentRequest ? 'requestSent' : 'readyToJoin'}
                        />
                        <CustomTypography
                            variant="body1"
                            color="text.secondary"
                            nameSpace="meeting"
                            translation={isUserSentRequest ? 'enterPermission' : 'checkDevices'}
                        />
                        {isUserSentRequest ||
                        (!(videoDevices.length && audioDevices.length) && !error) ? (
                            <WiggleLoader className={styles.loader} />
                        ) : (
                            <SelectDevices
                                key={changeStream?.id}
                                className={styles.selectDevicesWrapper}
                            />
                        )}
                    </CustomGrid>
                </CustomGrid>
            </CustomGrid>
            <CustomButton
                onClick={isUserSentRequest ? handleCancelRequest : handleJoinMeeting}
                className={styles.joinBtn}
                nameSpace="meeting"
                variant={isUserSentRequest ? 'custom-cancel' : 'custom-primary'}
                translation={isUserSentRequest ? 'buttons.cancel' : 'buttons.join'}
            />
        </CustomPaper>
    );
});

export { DevicesSettings };
