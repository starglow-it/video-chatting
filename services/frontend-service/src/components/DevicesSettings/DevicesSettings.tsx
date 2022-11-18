import React, { memo, useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import clsx from 'clsx';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';
import { useToggle } from '@hooks/useToggle';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomButton, CustomCheckbox } from 'shared-frontend/library';
import { CustomDivider } from 'shared-frontend/library';

// components
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';
import { MediaPreview } from '@components/Media/MediaPreview/MediaPreview';
import { MeetingSettingsContent } from '@components/Meeting/MeetingSettingsContent/MeetingSettingsContent';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';
import { Translation } from '@library/common/Translation/Translation';

// stores
import { MeetingAccessStatusEnum } from 'shared-types';
import { $profileStore, addNotificationEvent } from '../../store';
import {
    $audioDevicesStore,
    $audioErrorStore,
    $backgroundAudioVolume,
    $changeStreamStore,
    $isAuraActive,
    $isBackgroundAudioActive,
    $isCameraActiveStore,
    $isMicActiveStore,
    $isOwner,
    $isStreamRequestedStore,
    $isUserSendEnterRequest,
    $localUserStore,
    $meetingTemplateStore,
    $videoDevicesStore,
    $videoErrorStore,
    joinMeetingEvent,
    sendCancelAccessMeetingRequestEvent,
    sendEnterMeetingRequestSocketEvent,
    sendEnterWaitingRoomSocketEvent,
    setIsAudioActiveEvent,
    setIsCameraActiveEvent,
    toggleIsAuraActive,
    updateLocalUserEvent,
    updateMeetingTemplateFxWithData,
    updateUserSocketEvent,
} from '../../store/roomStores';

// types
import { NotificationType, UserTemplate } from '../../store/types';

// styles
import styles from './DevicesSettings.module.scss';

import { booleanSchema, simpleStringSchema } from '../../validation/common';
import { templatePriceSchema } from '../../validation/payments/templatePrice';

const validationSchema = yup.object({
    templatePrice: templatePriceSchema(),
    isMonetizationEnabled: booleanSchema(),
    templateCurrency: simpleStringSchema().required('required'),
});

type MonetizationFormType = {
    templatePrice: UserTemplate['templatePrice'];
    isMonetizationEnabled: UserTemplate['isMonetizationEnabled'];
    templateCurrency: UserTemplate['templateCurrency'];
};

const Component = () => {
    const profile = useStore($profileStore);
    const localUser = useStore($localUserStore);

    const isStreamRequested = useStore($isStreamRequestedStore);
    const changeStream = useStore($changeStreamStore);
    const isMicActive = useStore($isMicActiveStore);
    const isCameraActive = useStore($isCameraActiveStore);
    const videoDevices = useStore($videoDevicesStore);
    const audioDevices = useStore($audioDevicesStore);
    const videoError = useStore($videoErrorStore);
    const audioError = useStore($audioErrorStore);

    const isOwner = useStore($isOwner);
    const isUserSentEnterRequest = useStore($isUserSendEnterRequest);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isBackgroundAudioActive = useStore($isBackgroundAudioActive);
    const backgroundAudioVolume = useStore($backgroundAudioVolume);
    const isAuraActive = useStore($isAuraActive);

    const isEnterMeetingRequestPending = useStore(sendEnterMeetingRequestSocketEvent.pending);
    const isEnterWaitingRoomRequestPending = useStore(sendEnterWaitingRoomSocketEvent.pending);

    const [settingsBackgroundAudioVolume, setSettingsBackgroundAudioVolume] =
        useState<number>(backgroundAudioVolume);

    const resolver = useYupValidationResolver<MonetizationFormType>(validationSchema);

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

    const { value: needToRememberSettings, onToggleSwitch: handleToggleRememberSettings } =
        useToggle(false);

    const { value: isSettingsAudioBackgroundActive, onToggleSwitch: handleToggleBackgroundAudio } =
        useToggle(isBackgroundAudioActive);

    const { isMobile } = useBrowserDetect();

    useEffect(() => {
        updateLocalUserEvent({
            isAuraActive,
        });
    }, [isAuraActive]);

    const handleToggleMic = useCallback(() => {
        addNotificationEvent({
            type: NotificationType.MicAction,
            message: `meeting.mic.${isMicActive ? 'off' : 'on'}`,
        });

        updateLocalUserEvent({
            micStatus: isMicActive ? 'inactive' : 'active',
        });
        setIsAudioActiveEvent(!isMicActive);
    }, [isMicActive]);

    const handleToggleCamera = useCallback(() => {
        addNotificationEvent({
            type: NotificationType.CamAction,
            message: `meeting.cam.${isCameraActive ? 'off' : 'on'}`,
        });
        updateLocalUserEvent({
            cameraStatus: isCameraActive ? 'inactive' : 'active',
        });
        setIsCameraActiveEvent(!isCameraActive);
    }, [isCameraActive]);

    const handleJoinMeeting = useCallback(async () => {
        joinMeetingEvent({
            isSettingsAudioBackgroundActive,
            settingsBackgroundAudioVolume,
            needToRememberSettings,
        });
    }, [isSettingsAudioBackgroundActive, settingsBackgroundAudioVolume, needToRememberSettings]);

    const handleCancelRequest = useCallback(async () => {
        await sendCancelAccessMeetingRequestEvent();
    }, []);

    const onSubmit = useCallback(
        handleSubmit(async data => {
            await updateMeetingTemplateFxWithData(data as Partial<UserTemplate>);

            await handleJoinMeeting();
        }),
        [isOwner, handleJoinMeeting],
    );

    const handleBack = useCallback(async () => {
        if (isUserSentEnterRequest) {
            await sendCancelAccessMeetingRequestEvent();
        }

        updateLocalUserEvent({
            accessStatus: MeetingAccessStatusEnum.EnterName,
        });
        updateUserSocketEvent({ accessStatus: MeetingAccessStatusEnum.EnterName });
    }, [isUserSentEnterRequest]);

    const isAudioError = Boolean(audioError);

    const isEnterMeetingDisabled =
        isAudioError ||
        isEnterMeetingRequestPending ||
        isEnterWaitingRoomRequestPending ||
        localUser.accessStatus === MeetingAccessStatusEnum.Waiting;

    const joinHandler = isOwner ? onSubmit : handleJoinMeeting;

    return (
        <FormProvider {...methods}>
            <CustomGrid container direction="column" wrap="nowrap">
                <CustomGrid
                    container
                    direction={isMobile ? 'column' : 'row'}
                    wrap="nowrap"
                    className={clsx(styles.settingsContent, { [styles.mobile]: isMobile })}
                >
                    <MediaPreview
                        videoError={videoError}
                        audioError={audioError}
                        isMicActive={isMicActive}
                        isCameraActive={isCameraActive}
                        videoDevices={videoDevices}
                        audioDevices={audioDevices}
                        profileAvatar={profile.profileAvatar?.url}
                        userName={localUser?.username}
                        stream={changeStream}
                        onToggleAudio={handleToggleMic}
                        onToggleVideo={handleToggleCamera}
                    />
                    <CustomDivider orientation="vertical" flexItem />
                    <CustomGrid
                        className={styles.devicesWrapper}
                        container
                        direction={isMobile && isUserSentEnterRequest ? 'column-reverse' : 'column'}
                        wrap="nowrap"
                    >
                        {isUserSentEnterRequest ||
                        (!isUserSentEnterRequest &&
                            localUser.accessStatus === MeetingAccessStatusEnum.Waiting) ? (
                            <>
                                <CustomGrid container direction="column">
                                    <CustomTypography
                                        className={styles.title}
                                        variant="h3bold"
                                        nameSpace="meeting"
                                        translation={
                                            localUser.accessStatus ===
                                            MeetingAccessStatusEnum.Waiting
                                                ? 'meetingNotStarted.title'
                                                : 'requestSent'
                                        }
                                    />
                                    <CustomTypography
                                        variant="body1"
                                        color="text.secondary"
                                        nameSpace="meeting"
                                        translation={
                                            localUser.accessStatus ===
                                            MeetingAccessStatusEnum.Waiting
                                                ? 'meetingNotStarted.text'
                                                : 'enterPermission'
                                        }
                                    />
                                </CustomGrid>
                                <ConditionalRender condition={isUserSentEnterRequest}>
                                    <CustomGrid
                                        container
                                        alignItems="center"
                                        direction={isMobile ? 'row' : 'column-reverse'}
                                        className={clsx(styles.loader, {
                                            [styles.mobile]: isMobile,
                                        })}
                                        gap={1}
                                    >
                                        <WiggleLoader />
                                        <CustomTypography
                                            color="colors.orange.primary"
                                            nameSpace="meeting"
                                            translation="waitForHost"
                                        />
                                    </CustomGrid>
                                </ConditionalRender>
                            </>
                        ) : (
                            <MeetingSettingsContent
                                stream={changeStream}
                                isBackgroundActive={isSettingsAudioBackgroundActive}
                                backgroundVolume={settingsBackgroundAudioVolume}
                                isAuraActive={isAuraActive}
                                isMonetizationEnabled={Boolean(profile?.isStripeEnabled)}
                                onBackgroundToggle={handleToggleBackgroundAudio}
                                onChangeBackgroundVolume={setSettingsBackgroundAudioVolume}
                                onToggleAura={toggleIsAuraActive}
                                isMonetizationAvailable
                                isAudioActive={meetingTemplate.isAudioAvailable}
                                title={
                                    <CustomTypography
                                        className={styles.title}
                                        variant="h3bold"
                                        nameSpace="meeting"
                                        translation={isMobile ? 'settings.main' : 'readyToJoin'}
                                    />
                                }
                            />
                        )}
                        <ConditionalRender condition={isOwner}>
                            <CustomCheckbox
                                labelClassName={styles.label}
                                checked={needToRememberSettings}
                                label={
                                    <Translation
                                        nameSpace="meeting"
                                        translation="settings.remember"
                                    />
                                }
                                onChange={handleToggleRememberSettings}
                            />
                        </ConditionalRender>
                    </CustomGrid>
                </CustomGrid>
            </CustomGrid>
            <ConditionalRender condition={isMobile && isAudioError}>
                <CustomTypography
                    textAlign="center"
                    color="colors.red.primary"
                    nameSpace="meeting"
                    translation="allowAudio"
                    className={styles.devicesError}
                />
            </ConditionalRender>
            <CustomGrid
                container
                gap={1}
                wrap="nowrap"
                className={clsx(styles.joinBtn, { [styles.mobile]: isMobile })}
            >
                <ConditionalRender condition={!isUserSentEnterRequest}>
                    <CustomButton
                        onClick={handleBack}
                        variant="custom-cancel"
                        label={<Translation nameSpace="common" translation="buttons.back" />}
                    />
                </ConditionalRender>
                <CustomButton
                    onClick={isUserSentEnterRequest ? handleCancelRequest : joinHandler}
                    disabled={isEnterMeetingDisabled || isStreamRequested}
                    label={
                        <Translation
                            nameSpace="meeting"
                            translation={isUserSentEnterRequest ? 'buttons.cancel' : 'buttons.join'}
                        />
                    }
                    variant={isUserSentEnterRequest ? 'custom-cancel' : 'custom-primary'}
                />
            </CustomGrid>
        </FormProvider>
    );
};

export const DevicesSettings = memo(Component);
