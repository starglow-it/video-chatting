import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';
import { useToggle } from '@hooks/useToggle';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomDivider } from '@library/custom/CustomDivider/CustomDivider';
import { CustomCheckbox } from '@library/custom/CustomCheckbox/CustomCheckbox';

// components
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';
import { MediaPreview } from '@components/Media/MediaPreview/MediaPreview';
import { MeetingSettingsContent } from '@components/Meeting/MeetingSettingsContent/MeetingSettingsContent';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// context
import { VideoEffectsContext } from '../../contexts/VideoEffectContext';

// context
import { MediaContext } from '../../contexts/MediaContext';

// stores
import {
    $backgroundAudioVolume,
    $isBackgroundAudioActive,
    $isMeetingInstanceExists,
    $isOwner,
    $isOwnerInMeeting,
    $isUserSendEnterRequest,
    $meetingTemplateStore,
    $profileStore,
    addNotificationEvent,
    emitCancelEnterMeetingEvent,
    emitEnterWaitingRoom,
    enterMeetingRequest,
    sendEnterWaitingRoom,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
    startMeeting,
    updateLocalUserEvent,
    updateMeetingTemplateFxWithData,
} from '../../store';

// types
import { MeetingAccessStatuses, NotificationType } from '../../store/types';

// styles
import styles from './DevicesSettings.module.scss';

import { booleanSchema, simpleStringSchema } from '../../validation/common';
import { templatePriceSchema } from '../../validation/payments/templatePrice';
import { StorageKeysEnum, WebStorage } from '../../controllers/WebStorageController';

const validationSchema = yup.object({
    templatePrice: templatePriceSchema(),
    isMonetizationEnabled: booleanSchema(),
    templateCurrency: simpleStringSchema().required('required'),
});

const DevicesSettings = memo(() => {
    const isOwner = useStore($isOwner);
    const profile = useStore($profileStore);
    const isOwnerInMeeting = useStore($isOwnerInMeeting);
    const isMeetingInstanceExists = useStore($isMeetingInstanceExists);
    const isUserSentEnterRequest = useStore($isUserSendEnterRequest);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isBackgroundAudioActive = useStore($isBackgroundAudioActive);
    const backgroundAudioVolume = useStore($backgroundAudioVolume);
    const isEnterMeetingRequestPending = useStore(enterMeetingRequest.pending);
    const isEnterWaitingRoomRequestPending = useStore(sendEnterWaitingRoom.pending);

    const [settingsBackgroundAudioVolume, setSettingsBackgroundAudioVolume] =
        useState<number>(backgroundAudioVolume);

    const { value: needToRememberSettings, onToggleSwitch: handleToggleRememberSettings } =
        useToggle(false);

    const resolver = useYupValidationResolver<{
        templatePrice: number;
        isMonetizationEnabled: boolean;
        templateCurrency: string;
    }>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            isMonetizationEnabled: Boolean(meetingTemplate.isMonetizationEnabled),
            templatePrice: meetingTemplate.templatePrice || 10,
            templateCurrency: meetingTemplate.templateCurrency,
        },
    });

    const { handleSubmit } = methods;

    const {
        data: {
            isStreamRequested,
            changeStream,
            audioError,
            isMicActive,
            isCameraActive,
            currentAudioDevice,
            currentVideoDevice,
        },
    } = useContext(MediaContext);

    const {
        data: { isBlurActive },
        actions: { onToggleBlur },
    } = useContext(VideoEffectsContext);

    const { value: isSettingsAudioBackgroundActive, onToggleSwitch: handleToggleBackgroundAudio } =
        useToggle(isBackgroundAudioActive);

    useEffect(() => {
        updateLocalUserEvent({
            isAuraActive: isBlurActive,
        });
    }, [isBlurActive]);

    const handleToggleMic = useCallback(() => {
        if (changeStream) {
            addNotificationEvent({
                type: NotificationType.MicAction,
                message: `meeting.mic.${!isMicActive ? 'on' : 'off'}`,
            });

            updateLocalUserEvent({
                micStatus: !isMicActive ? 'active' : 'inactive',
            });
        }
    }, [changeStream, isMicActive]);

    const handleToggleCamera = useCallback(() => {
        if (changeStream) {
            addNotificationEvent({
                type: NotificationType.CamAction,
                message: `meeting.cam.${!isCameraActive ? 'on' : 'off'}`,
            });
            updateLocalUserEvent({
                cameraStatus: !isCameraActive ? 'active' : 'inactive',
            });
        }
    }, [changeStream, isCameraActive]);

    const handleJoinMeeting = useCallback(async () => {
        if (!isStreamRequested) {
            if (isOwner) {
                await startMeeting({});
            } else if (isMeetingInstanceExists && isOwnerInMeeting) {
                await enterMeetingRequest({});
            } else {
                emitEnterWaitingRoom();
            }

            setBackgroundAudioVolume(settingsBackgroundAudioVolume);
            setBackgroundAudioActive(isSettingsAudioBackgroundActive);

            if (needToRememberSettings) {
                WebStorage.save({
                    key: StorageKeysEnum.meetingSettings,
                    data: {
                        backgroundAudioSetting: isSettingsAudioBackgroundActive,
                        backgroundAudioVolumeSetting: settingsBackgroundAudioVolume,
                        blurSetting: isBlurActive,
                        savedVideoDeviceId: currentVideoDevice,
                        savedAudioDeviceId: currentAudioDevice,
                        cameraActiveSetting: isCameraActive,
                        micActiveSetting: isMicActive,
                    },
                });
            }
        }
    }, [
        isOwner,
        changeStream,
        isStreamRequested,
        isMeetingInstanceExists,
        isOwnerInMeeting,
        isBlurActive,
        isSettingsAudioBackgroundActive,
        settingsBackgroundAudioVolume,
        needToRememberSettings,
        currentVideoDevice,
        currentAudioDevice,
        isCameraActive,
        isMicActive,
    ]);

    const handleCancelRequest = useCallback(async () => {
        emitCancelEnterMeetingEvent();
    }, []);

    const onSubmit = useCallback(
        handleSubmit(async data => {
            await updateMeetingTemplateFxWithData(data);

            await handleJoinMeeting();
        }),
        [isOwner, handleJoinMeeting],
    );

    const handleBack = useCallback(() => {
        if (isUserSentEnterRequest) {
            emitCancelEnterMeetingEvent();
        }

        updateLocalUserEvent({
            accessStatus: MeetingAccessStatuses.EnterName,
        });
    }, [isUserSentEnterRequest]);

    const isEnterMeetingDisabled =
        audioError === 'media.notAllowed' ||
        isEnterMeetingRequestPending ||
        isEnterWaitingRoomRequestPending;

    const joinHandler = isOwner ? onSubmit : handleJoinMeeting;

    return (
        <CustomPaper className={styles.wrapper}>
            <FormProvider {...methods}>
                <CustomGrid container direction="column">
                    <CustomGrid container wrap="nowrap" className={styles.settingsContent}>
                        <MediaPreview
                            stream={changeStream}
                            onToggleAudio={handleToggleMic}
                            onToggleVideo={handleToggleCamera}
                        />
                        <CustomDivider orientation="vertical" flexItem />
                        <CustomGrid
                            className={styles.devicesWrapper}
                            container
                            direction="column"
                            wrap="nowrap"
                        >
                            {isUserSentEnterRequest ? (
                                <>
                                    <CustomTypography
                                        className={styles.title}
                                        variant="h3bold"
                                        nameSpace="meeting"
                                        translation="requestSent"
                                    />
                                    <CustomTypography
                                        variant="body1"
                                        color="text.secondary"
                                        nameSpace="meeting"
                                        translation="enterPermission"
                                    />
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
                                </>
                            ) : (
                                <MeetingSettingsContent
                                    stream={changeStream}
                                    isBackgroundActive={isSettingsAudioBackgroundActive}
                                    backgroundVolume={settingsBackgroundAudioVolume}
                                    isBlurActive={isBlurActive}
                                    isMonetizationEnabled={Boolean(profile?.isStripeEnabled)}
                                    onBackgroundToggle={handleToggleBackgroundAudio}
                                    onChangeBackgroundVolume={setSettingsBackgroundAudioVolume}
                                    onToggleBlur={onToggleBlur}
                                    isMonetizationAvailable
                                    isAudioActive={meetingTemplate.isAudioAvailable}
                                    title={
                                        <CustomTypography
                                            className={styles.title}
                                            variant="h3bold"
                                            nameSpace="meeting"
                                            translation="readyToJoin"
                                        />
                                    }
                                />
                            )}
                            <ConditionalRender condition={isOwner}>
                                <CustomCheckbox
                                    labelClassName={styles.label}
                                    checked={needToRememberSettings}
                                    onChange={handleToggleRememberSettings}
                                    translationProps={{
                                        nameSpace: 'meeting',
                                        translation: 'settings.remember',
                                    }}
                                />
                            </ConditionalRender>
                        </CustomGrid>
                    </CustomGrid>
                </CustomGrid>
                <CustomGrid container gap={1} wrap="nowrap" className={styles.joinBtn}>
                    <ConditionalRender condition={!isUserSentEnterRequest}>
                        <CustomButton
                            onClick={handleBack}
                            variant="custom-cancel"
                            nameSpace="common"
                            translation="buttons.back"
                        />
                    </ConditionalRender>
                    <CustomButton
                        onClick={isUserSentEnterRequest ? handleCancelRequest : joinHandler}
                        disabled={isEnterMeetingDisabled || isStreamRequested}
                        nameSpace="meeting"
                        variant={isUserSentEnterRequest ? 'custom-cancel' : 'custom-primary'}
                        translation={isUserSentEnterRequest ? 'buttons.cancel' : 'buttons.join'}
                    />
                </CustomGrid>
            </FormProvider>
        </CustomPaper>
    );
});

export { DevicesSettings };
