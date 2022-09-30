import React, { memo, useEffect, useMemo } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

// hooks
import { useSubscriptionNotification } from '@hooks/useSubscriptionNotification';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// common
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';

// components
import { EnterMeetingName } from '@components/EnterMeetingName/EnterMeetingName';
import { KickedUser } from '@components/KickedUser/KickedUser';
import { MeetingErrorDialog } from '@components/Dialogs/MeetingErrorDialog/MeetingErrorDialog';
import { MeetingPreview } from '@components/Meeting/MeetingPreview/MeetingPreview';
import { DevicesSettings } from '@components/DevicesSettings/DevicesSettings';
import { HostTimeExpiredDialog } from '@components/Dialogs/HostTimeExpiredDialog/HostTimeExpiredDialog';

// stores
import {
    appDialogsApi,
    getSubscriptionWithDataFx,
    initLandscapeListener,
    initWindowListeners,
    joinRoomBeforeMeetingSocketEvent,
    removeLandscapeListener,
    removeWindowListeners,
    resetRoomStores,
    startWaitForServerSocketEvent,
} from '../../store';
import {
    $isMeetingSocketConnected,
    $isOwner,
    $localUserStore,
    $meetingTemplateStore,
    getMeetingTemplateFx,
    sendJoinMeetingEventSocketEvent,
    sendStartMeetingSocketEvent,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
    updateLocalUserEvent,
    initiateMeetingSocketConnectionEvent,
    $isMeetingSocketConnecting,
} from '../../store/roomStores';

// types
import { MeetingAccessStatuses } from '../../store/types';
import { SavedSettings } from '../../types';

// styles
import styles from './MeetingContainer.module.scss';

// utils
import { StorageKeysEnum, WebStorage } from '../../controllers/WebStorageController';
import { getClientMeetingUrl } from '../../utils/urls';

const MeetingView = dynamic(() => import('@components/Meeting/MeetingView/MeetingView'), {
    ssr: false,
});

const NotMeetingComponent = memo(() => {
    const meetingUser = useStore($localUserStore);

    const ChildComponent = useMemo(() => {
        if (meetingUser.accessStatus === MeetingAccessStatuses.EnterName) {
            return EnterMeetingName;
        }
        if (meetingUser.accessStatus === MeetingAccessStatuses.Kicked) {
            return KickedUser;
        }

        return DevicesSettings;
    }, [meetingUser.accessStatus]);

    return (
        <CustomPaper className={styles.wrapper}>
            <CustomScroll className={styles.scroll}>
                <CustomGrid container direction="column" wrap="nowrap">
                    <ChildComponent />
                </CustomGrid>
            </CustomScroll>
        </CustomPaper>
    );
});

const MeetingContainer = memo(() => {
    const router = useRouter();

    const meetingUser = useStore($localUserStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isOwner = useStore($isOwner);
    const isMeetingSocketConnected = useStore($isMeetingSocketConnected);
    const isMeetingSocketConnecting = useStore($isMeetingSocketConnecting);

    useEffect(() => {
        getSubscriptionWithDataFx();
    }, []);

    const { isMobile } = useBrowserDetect();

    useEffect(() => {
        initWindowListeners();
        initLandscapeListener();

        return () => {
            removeWindowListeners();
            removeLandscapeListener();
        };
    }, []);

    useSubscriptionNotification(getClientMeetingUrl(router.query.token as string));

    useEffect(() => {
        (async () => {
            await getMeetingTemplateFx({
                templateId: router.query.token as string,
            });

            updateLocalUserEvent({
                accessStatus: MeetingAccessStatuses.EnterName,
            });
        })();

        return () => {
            resetRoomStores();

            appDialogsApi.resetDialogs();
        };
    }, []);

    useEffect(() => {
        (async () => {
            if (meetingTemplate?.meetingInstance?.serverStatus === 'inactive') {
                if (isOwner) {
                    startWaitForServerSocketEvent({
                        templateId: meetingTemplate.id,
                    });
                } else {
                    joinRoomBeforeMeetingSocketEvent({
                        templateId: meetingTemplate.id,
                    });
                }
            }
        })();
    }, [meetingTemplate?.meetingInstance]);

    useEffect(() => {
        if (
            meetingTemplate?.meetingInstance?.serverIp &&
            meetingTemplate.meetingInstance.serverStatus === 'active' &&
            !isMeetingSocketConnecting
        ) {
            initiateMeetingSocketConnectionEvent();
        }
    }, [meetingTemplate?.meetingInstance, isMeetingSocketConnecting]);

    useEffect(() => {
        (async () => {
            const savedSettings = WebStorage.get<SavedSettings>({
                key: StorageKeysEnum.meetingSettings,
            });

            if (Object.keys(savedSettings)?.length) {
                setBackgroundAudioVolume(savedSettings.backgroundAudioVolumeSetting);
                setBackgroundAudioActive(savedSettings.backgroundAudioSetting);
            }

            if (isMeetingSocketConnected) {
                await sendJoinMeetingEventSocketEvent();

                if (Object.keys(savedSettings)?.length && isOwner) {
                    updateLocalUserEvent({
                        isAuraActive: savedSettings.auraSetting,
                        cameraStatus: savedSettings.cameraActiveSetting ? 'active' : 'inactive',
                        micStatus: savedSettings.micActiveSetting ? 'active' : 'inactive',
                    });

                    sendStartMeetingSocketEvent();
                }
            }
        })();
    }, [isMeetingSocketConnected, isOwner]);

    return (
        <>
            {Boolean(meetingTemplate?.id) && (
                <>
                    {MeetingAccessStatuses.InMeeting !== meetingUser.accessStatus ? (
                        <CustomBox
                            className={clsx(styles.waitingRoomWrapper, {
                                [styles.mobile]: isMobile,
                            })}
                        >
                            <MeetingPreview />
                            <NotMeetingComponent />
                        </CustomBox>
                    ) : (
                        <MeetingView />
                    )}
                </>
            )}
            <HostTimeExpiredDialog />
            <MeetingErrorDialog />
        </>
    );
});

export default MeetingContainer;
