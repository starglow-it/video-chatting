import React, { memo, useCallback, useContext } from 'react';
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
    $isMeetingInstanceExists,
    $isOwner,
    $isUserSendEnterRequest,
    emitCancelEnterMeetingEvent,
    emitEnterMeetingEvent,
    emitStartMeetingEvent,
    setIsUserSendEnterRequest,
} from '../../store/meeting';
import { $localUserStore, updateLocalUserStateEvent } from '../../store/users';
import { addNotificationEvent } from '../../store/notifications';
import { emitSendEnterWaitingRoom } from '../../store/waitingRoom';

// types
import { NotificationType } from '../../store/types';

// styles
import styles from './DevicesSettings.module.scss';

const DevicesSettings = memo(() => {
    const isOwner = useStore($isOwner);
    const isMeetingInstanceExists = useStore($isMeetingInstanceExists);
    const isUserSentEnterRequest = useStore($isUserSendEnterRequest);

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

    const handleToggleMic = useCallback(() => {
        if (changeStream) {
            addNotificationEvent({
                type: NotificationType.MicAction,
                message: `meeting.mic.${!isMicActive ? 'on' : 'off'}`,
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
                message: `meeting.cam.${!isCameraActive ? 'on' : 'off'}`,
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
                    if (isMeetingInstanceExists) {
                        emitEnterMeetingEvent();
                    } else {
                        emitSendEnterWaitingRoom();
                    }
                    setIsUserSendEnterRequest(true);
                }
            } else {
                handleToggleCamera();
            }
        }
    }, [isOwner, changeStream, error, isStreamRequested, isMeetingInstanceExists]);

    const handleCancelRequest = useCallback(async () => {
        emitCancelEnterMeetingEvent();
        setIsUserSendEnterRequest(false);
    }, []);

    return (
        <CustomPaper className={styles.wrapper}>
            <CustomGrid container direction="column">
                <CustomGrid container wrap="nowrap" className={styles.settingsContent}>
                    <MediaPreview
                        stream={changeStream}
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
                            translation={isUserSentEnterRequest ? 'requestSent' : 'readyToJoin'}
                        />
                        <CustomTypography
                            variant="body1"
                            color="text.secondary"
                            nameSpace="meeting"
                            translation={
                                isUserSentEnterRequest ? 'enterPermission' : 'checkDevices'
                            }
                        />
                        {isUserSentEnterRequest ||
                        (!(videoDevices.length && audioDevices.length) && !error) ? (
                            <CustomGrid
                                    container
                                    alignItems="center"
                                    className={styles.loader}
                                    gap={1}
                                >
                                <WiggleLoader />
                                <CustomTypography
                                        color="colors.orange.primary"
                                        nameSpace="meeting"
                                        translation="waitForHost"
                                    />
                            </CustomGrid>
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
                onClick={isUserSentEnterRequest ? handleCancelRequest : handleJoinMeeting}
                className={styles.joinBtn}
                nameSpace="meeting"
                variant={isUserSentEnterRequest ? 'custom-cancel' : 'custom-primary'}
                translation={isUserSentEnterRequest ? 'buttons.cancel' : 'buttons.join'}
            />
        </CustomPaper>
    );
});

export { DevicesSettings };
