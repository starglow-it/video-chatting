import React, { memo, useCallback, useContext } from 'react';
import { useStore } from 'effector-react';
import * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";

// helpers

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomDivider } from '@library/custom/CustomDivider/CustomDivider';

// components
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';
import { MediaPreview } from '@components/Media/MediaPreview/MediaPreview';
import { MeetingSettingsContent } from '@components/Meeting/MeetingSettingsContent/MeetingSettingsContent';
import { useYupValidationResolver } from "../../hooks/useYupValidationResolver";

// context
import {VideoEffectsContext} from "../../contexts/VideoEffectContext";

// context
import { MediaContext } from '../../contexts/MediaContext';

// stores
import {
    $isMeetingInstanceExists,
    $isOwner,
    $isOwnerInMeeting,
    $isUserSendEnterRequest, $meetingTemplateStore,
    emitCancelEnterMeetingEvent,
    emitEnterMeetingEvent,
    emitStartMeetingEvent,
    setIsUserSendEnterRequest,
    updateMeetingTemplateFxWithData,
} from '../../store';
import { updateLocalUserStateEvent } from '../../store';
import { addNotificationEvent } from '../../store';
import { emitSendEnterWaitingRoom } from '../../store';
import {
    $isSettingsBackgroundAudioActive,
    $settingsBackgroundAudioVolume,
    setBackgroundAudioActive,
    setBackgroundAudioVolume,
} from '../../store';

// types
import {MeetingAccessStatuses, NotificationType} from '../../store/types';

// styles
import styles from './DevicesSettings.module.scss';

import {booleanSchema, simpleStringSchema} from "../../validation/common";

const validationSchema = yup.object({
    templatePrice: simpleStringSchema(),
    isMonetizationEnabled: booleanSchema(),
    templateCurrency: simpleStringSchema().required('required'),
});

const DevicesSettings = memo(() => {
    const isOwner = useStore($isOwner);
    const isOwnerInMeeting = useStore($isOwnerInMeeting);
    const isMeetingInstanceExists = useStore($isMeetingInstanceExists);
    const isUserSentEnterRequest = useStore($isUserSendEnterRequest);
    const meetingTemplate = useStore($meetingTemplateStore);
    const settingsBackgroundAudioVolume = useStore($settingsBackgroundAudioVolume);
    const isSettingsBackgroundAudioActive = useStore($isSettingsBackgroundAudioActive);

    const resolver = useYupValidationResolver<{ templatePrice: number; isMonetizationEnabled: boolean; templateCurrency: string }>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            isMonetizationEnabled: Boolean(meetingTemplate.isMonetizationEnabled),
            templatePrice: meetingTemplate.templatePrice || 10,
            templateCurrency: meetingTemplate.templateCurrency,
        }
    });

    const {
        handleSubmit,
    } = methods;

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

    const { data: { isBlurActive } } = useContext(VideoEffectsContext);

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
                updateLocalUserStateEvent({
                    isAuraActive: isBlurActive
                });

                if (isOwner) {
                    emitStartMeetingEvent();
                } else {
                    if (isMeetingInstanceExists && isOwnerInMeeting) {
                        emitEnterMeetingEvent();
                    } else {
                        emitSendEnterWaitingRoom();
                    }
                    setIsUserSendEnterRequest(true);
                }

                setBackgroundAudioVolume(settingsBackgroundAudioVolume);
                setBackgroundAudioActive(isSettingsBackgroundAudioActive);
            } else {
                handleToggleCamera();
            }
        }
    }, [
        isOwner,
        changeStream,
        error,
        isStreamRequested,
        isMeetingInstanceExists,
        isOwnerInMeeting,
        settingsBackgroundAudioVolume,
        isSettingsBackgroundAudioActive,
        isBlurActive,
    ]);

    const handleCancelRequest = useCallback(async () => {
        emitCancelEnterMeetingEvent();
        setIsUserSendEnterRequest(false);
    }, []);

    const onSubmit = useCallback(handleSubmit(async (data) => {
        try {
            await updateMeetingTemplateFxWithData(data);

            handleJoinMeeting();
        } catch (e) {
            console.log(e);
        }
    }),[isOwner]);

    const handleBack = useCallback(() => {
        if (isUserSentEnterRequest) {
            emitCancelEnterMeetingEvent();
            setIsUserSendEnterRequest(false);
        }

        updateLocalUserStateEvent({
            accessStatus: MeetingAccessStatuses.EnterName,
        });
    }, [isUserSentEnterRequest]);

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
                            {isUserSentEnterRequest ||
                            (!(videoDevices.length && audioDevices.length) && !error) ? (
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
                        </CustomGrid>
                    </CustomGrid>
                </CustomGrid>
                <CustomGrid
                    container
                    gap={1}
                    wrap="nowrap"
                    className={styles.joinBtn}
                >
                    {!isUserSentEnterRequest
                        ? (
                            <CustomButton
                                onClick={handleBack}
                                variant="custom-cancel"
                                nameSpace="common"
                                translation="buttons.back"
                            />
                        )
                        : null
                    }
                    <CustomButton
                        onClick={isUserSentEnterRequest ? handleCancelRequest : (isOwner ? onSubmit : handleJoinMeeting)}
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
