import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useStore } from 'effector-react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';
import * as yup from 'yup';
import Router from 'next/router';

import { PaymentType } from 'shared-const';

import { MeetingRole } from 'shared-types';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomAccordion } from 'shared-frontend/library/custom/CustomAccordion';
import { Translation } from '@library/common/Translation/Translation';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { EditMeetingLink } from '@components/Meeting/EditMeetingLink/EditMeetingLink';
import { MeetingMonetizationPanel } from '../MeetingMonetization/MeetingMonetizationPanel';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { CustomFade } from 'shared-frontend/library/custom/CustomFade';
import { CustomDivider } from 'shared-frontend/library/custom/CustomDivider';
import { CustomRange } from '@library/custom/CustomRange/CustomRange';

//components
import { MeetingAvatars } from '@components/Meeting/MeetingAvatars/MeetingAvatars';
import { SelectDevices } from '@components/Media/SelectDevices/SelectDevices';
import { LabeledSwitch } from '@library/common/LabeledSwitch/LabeledSwitch';
import { PaymentForm } from '@components/PaymentForm/PaymentForm';

//icons
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { BackgroundBlurIcon } from 'shared-frontend/icons/OtherIcons/BackgroundBlurIcon';
import { MusicIcon } from 'shared-frontend/icons/OtherIcons/MusicIcon';
import { SpeakerIcon } from 'shared-frontend/icons/OtherIcons/SpeakerIcon';

//hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';
import { useToggle } from '@hooks/useToggle';

import { SettingsData, FormDataPayment } from './types';
import { customTemplateLinkSchema } from 'shared-frontend/validation';
import { getClientMeetingUrlWithDomain } from '../../../utils/urls';
import { reduceValuesNumber } from '../../../helpers/mics/reduceKeysNumber';

//const
import { DEFAULT_PAYMENT_CURRENCY } from 'shared-const';

//store
import {
    checkCustomLinkFx,
    $isConnectedStripe,
    addNotificationEvent
} from 'src/store';

import { NotificationType } from 'src/store/types';
import {
    $doNotDisturbStore,
    $changeStreamStore,
    $isAuraActive,
    $meetingTemplateStore,
    $isBackgroundAudioActive,
    $backgroundAudioVolume,
    $roleQueryUrlStore,
    $isOwner,
    $isParticipant,
    $localUserStore,
    $isCameraActiveStore,
    $enabledPaymentMeetingParticipant,
    $enabledPaymentMeetingAudience,
    $paymentMeetingParticipant,
    $paymentMeetingAudience,
    $paymentIntent,
    $isToggleEditRuumePanel,
    createPaymentIntentWithData,
    cancelPaymentIntentWithData,
    setDoNotDisturbEvent,
    toggleIsAuraActive,
    updateMeetingTemplateFxWithData,
    updatePaymentMeetingEvent,
    updateUserSocketEvent,
    toggleEditRuumeSettingEvent
} from 'src/store/roomStores';

const validationSchema = yup.object({
    customLink: customTemplateLinkSchema(),
});

import styles from './MeetingEditRuumeSetting.module.scss';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

export const MeetingEditRuumeSetting = () => {
    const doNotDisturbStore = useStore($doNotDisturbStore);
    const changeStream = useStore($changeStreamStore);
    const isAuraActive = useStore($isAuraActive);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isBackgroundAudioActive = useStore($isBackgroundAudioActive);
    const backgroundAudioVolume = useStore($backgroundAudioVolume);
    const role = useStore($roleQueryUrlStore);
    const isOwner = useStore($isOwner);
    const isParticipant = useStore($isParticipant);
    const localUser = useStore($localUserStore);
    const isCameraActive = useStore($isCameraActiveStore);
    const isToggleEditRuumePanel = useStore($isToggleEditRuumePanel);
    const enabledPaymentMeetingParticipant = useStore(
        $enabledPaymentMeetingParticipant,
    );
    const enabledPaymentMeetingAudience = useStore($enabledPaymentMeetingAudience);
    const paymentMeetingParticipant = useStore($paymentMeetingParticipant);
    const paymentMeetingAudience = useStore($paymentMeetingAudience);
    const isCreatePaymentIntentPending = useStore(
        createPaymentIntentWithData.pending,
    );
    const paymentIntent = useStore($paymentIntent);
    const isConnectedStripe = useStore($isConnectedStripe);

    const [currentAccordionId, setCurrentAccordionId] = useState('');
    const [settingsBackgroundAudioVolume, setSettingsBackgroundAudioVolume] =
        useState<number>(backgroundAudioVolume);
    const intentId = paymentIntent?.id;

    const {
        value: isSettingsAudioBackgroundActive,
        onToggleSwitch: handleToggleBackgroundAudio,
    } = useToggle(isBackgroundAudioActive);

    const { isSafari, isMobile } = useBrowserDetect();

    const formParticipantsRef = useRef<{ getValues: () => FormDataPayment }>(
        null,
    );
    const formAudienceRef = useRef<{ getValues: () => FormDataPayment }>(null);

    const resolver = useYupValidationResolver<SettingsData>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            customLink: meetingTemplate.customLink,
        },
    });

    const {
        handleSubmit,
        formState: { dirtyFields, errors },
        reset,
        setError,
        setFocus,
    } = methods;

    useEffect(() => {
        if (currentAccordionId === 'monetization') {
            handleTogglePayment();
        }
    }, [currentAccordionId]);

    useEffect(() => {
        (async () => {
            let roomUrl = getClientMeetingUrlWithDomain(
                meetingTemplate.customLink || meetingTemplate.id,
            );

            if (role === MeetingRole.Audience && !isOwner) {
                roomUrl = `${roomUrl}?role=${role}`;
            }

            await Router.push(roomUrl, roomUrl, { shallow: true });
        })();
    }, [meetingTemplate.customLink, meetingTemplate.id, isOwner, role]);

    useEffect(() => {
        if (errors) {
            if (errors.fullName) {
                if (currentAccordionId !== 'personal') {
                    handleChangeAccordion('personal');
                }
                return;
            }
        }
    }, [errors]);

    useEffect(() => {
        if (!isToggleEditRuumePanel) {
            handleMonetizationSubmit();
        }
    }, [isToggleEditRuumePanel]);

    const handleChangeAccordion = useCallback((accordionId: any) => {
        setCurrentAccordionId(prev =>
            prev === accordionId ? '' : accordionId,
        );
    }, []);

    const handleDoNotDisturb = (e) => {
        e.preventDefault();
        setDoNotDisturbEvent(!doNotDisturbStore);
    };

    const handleCloseEditRuumePanel = () => {
        toggleEditRuumeSettingEvent(false);
    };

    const dirtyFieldsCount = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { socials, ...dirtyFieldsWithOutSocials } = dirtyFields;

        const values: any[] = Object.values(dirtyFieldsWithOutSocials);

        const newDirtyFieldsCount = values.reduce(reduceValuesNumber, 0);

        return newDirtyFieldsCount;
    }, [Object.keys(dirtyFields).length]);

    const handleUpdateMeetingTemplate = useCallback(async (updateData: any) => {
        if (updateData) {
            await updateMeetingTemplateFxWithData(updateData.data);
        }
    }, []);

    const handleMonetizationSubmit = async () => {
        const paymentParticipant = formParticipantsRef.current?.getValues();
        const paymentAudience = formAudienceRef.current?.getValues();
        updatePaymentMeetingEvent({
            meeting: {
                participant: {
                    enabled: paymentParticipant?.enabledMeeting ?? false,
                    price: paymentParticipant?.templatePrice ?? 5,
                    currency:
                        paymentParticipant?.templateCurrency ??
                        DEFAULT_PAYMENT_CURRENCY,
                },
                audience: {
                    enabled: paymentAudience?.enabledMeeting ?? false,
                    price: paymentAudience?.templatePrice ?? 5,
                    currency:
                        paymentAudience?.templateCurrency ??
                        DEFAULT_PAYMENT_CURRENCY,
                },
            },
            paywall: {
                participant: {
                    enabled: paymentParticipant?.enabledPaywall ?? false,
                    price: paymentParticipant?.paywallPrice ?? 5,
                    currency:
                        paymentParticipant?.paywallCurrency ??
                        DEFAULT_PAYMENT_CURRENCY,
                },
                audience: {
                    enabled: paymentAudience?.enabledPaywall ?? false,
                    price: paymentAudience?.paywallPrice ?? 5,
                    currency:
                        paymentAudience?.paywallCurrency ??
                        DEFAULT_PAYMENT_CURRENCY,
                },
            },
        });
    };

    const handleTogglePayment = () => {
        if (!isCreatePaymentIntentPending) {
            if (!intentId &&
                (enabledPaymentMeetingAudience || enabledPaymentMeetingParticipant)
            ) {
                createPaymentIntentWithData({
                    paymentType: PaymentType.Meeting,
                });
            }
        }
    };

    const handleToggleIsAuraActive = () => {
        updateUserSocketEvent({
            isAuraActive: !localUser.isAuraActive
        });
    };

    const onSubmit = useCallback(
        handleSubmit(async data => {
            if (!dirtyFieldsCount) {
                handleUpdateMeetingTemplate();
            } else {
                const { ...dataWithoutSocials } = data;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { ...dirtyDataWithoutSocials } =
                    dirtyFields;

                const dirtyFieldsKeys = Object.keys(dirtyDataWithoutSocials);

                const filteredData = Object.fromEntries(
                    Object.entries(dataWithoutSocials).filter(([key]) =>
                        dirtyFieldsKeys.includes(key),
                    ),
                );

                if (
                    filteredData.customLink &&
                    meetingTemplate.customLink !== filteredData.customLink
                ) {
                    const isBusy = await checkCustomLinkFx({
                        templateId: meetingTemplate.id,
                        customLink: filteredData.customLink as string,
                    });

                    if (isBusy) {
                        setError('customLink', {
                            type: 'focus',
                            message: 'meeting.settings.customLink.busy',
                        });
                        setFocus('customLink');
                        return;
                    }
                }

                handleUpdateMeetingTemplate({
                    data: {
                        ...filteredData,
                    } as any,
                    templateId: meetingTemplate.id,
                });

                reset({
                    ...dataWithoutSocials,
                });
            }

            if (isConnectedStripe) {
                await handleMonetizationSubmit();
            }
        }),
        [
            localUser,
            dirtyFieldsCount,
            meetingTemplate.id,
            meetingTemplate.customLink,
            errors,
        ],
    );

    const handleParticipantSubmit = async () => {
        if (localUser.meetingAvatarId) {
            await updateUserSocketEvent({
                meetingAvatarId: localUser.meetingAvatarId,
                cameraStatus: isCameraActive ? 'active' : 'inactive'
            });
        }
    };

    const handleOnSave = async () => {
        if (isOwner) {
            await onSubmit();
        }

        if (localUser.meetingRole === MeetingRole.Participant) {
            await handleParticipantSubmit();
        }
    };

    return (
        <FormProvider {...methods}>
            <CustomGrid
                container
                direction="column"
                className={styles.wrapper}
                gap={3}
            >
                <CustomTypography
                    nameSpace="meeting"
                    translation={!enabledPaymentMeetingAudience ? "editRuumePanel.title" : "buttons.payDonate"}
                    color="white"
                    fontSize="20px"
                />
                <CustomScroll>
                    <CustomGrid
                        container
                        direction="column"
                        className={styles.wrapper}
                        gap={3}
                    >
                        <ConditionalRender condition={isOwner}>
                            <form id="customLinkForm" onSubmit={onSubmit}>
                                <EditMeetingLink onSave={handleOnSave} />
                            </form>
                        </ConditionalRender>
                        <ConditionalRender condition={isOwner || enabledPaymentMeetingParticipant}>
                            <CustomAccordion
                                currentAccordionId={currentAccordionId}
                                accordionId="monetization"
                                onChange={handleChangeAccordion}
                                label={
                                    <Translation
                                        nameSpace="meeting"
                                        translation={
                                            isOwner
                                                ? "templates.monetization"
                                                : "buttons.payDonate"}
                                    />
                                }
                            >
                                <ConditionalRender condition={isOwner}>
                                    <MeetingMonetizationPanel
                                        formParticipantsRef={formParticipantsRef}
                                        formAudienceRef={formAudienceRef}
                                        onSave={handleOnSave}
                                    />
                                </ConditionalRender>
                            </CustomAccordion>
                        </ConditionalRender>
                        <ConditionalRender condition={isOwner || isParticipant}>
                            <CustomAccordion
                                currentAccordionId={currentAccordionId}
                                accordionId="videoAudioSettings"
                                onChange={handleChangeAccordion}
                                label={
                                    <Translation
                                        nameSpace="meeting"
                                        translation="templates.videoAudioSettings"
                                    />
                                }
                            >
                                <CustomGrid
                                    container
                                    direction="column"
                                    gap={2}
                                    className={styles.selectDevicesWrapper}
                                    sx={{
                                        marginTop: {
                                            xs: '15px',
                                            sm: '15px',
                                            xl: '30px',
                                            md: '30px',
                                        },
                                    }}
                                >
                                    <SelectDevices key={changeStream?.id} />
                                    <ConditionalRender condition={!isSafari}>
                                        <LabeledSwitch
                                            Icon={
                                                <BackgroundBlurIcon
                                                    width="24px"
                                                    height="24px"
                                                    className={styles.gapIcon}
                                                />
                                            }
                                            nameSpace="meeting"
                                            translation="features.transparencyBackground"
                                            checked={localUser.isAuraActive}
                                            onChange={handleToggleIsAuraActive}
                                            className={clsx(styles.switchWrapper, {
                                                [styles.switchWrapperMobile]: isMobile,
                                            })}
                                        />
                                    </ConditionalRender>
                                </CustomGrid>
                            </CustomAccordion>
                        </ConditionalRender>
                        <ConditionalRender condition={isOwner || isParticipant}>
                            <CustomAccordion
                                currentAccordionId={currentAccordionId}
                                accordionId="updateAvatar"
                                onChange={handleChangeAccordion}
                                label={
                                    <Translation
                                        nameSpace="meeting"
                                        translation="templates.updateAvatar"
                                    />
                                }
                            >
                                <MeetingAvatars
                                    devicesSettingsDialog={false}
                                    onClose={() => { }}
                                    onSave={handleOnSave}
                                />
                            </CustomAccordion>
                        </ConditionalRender>
                        <ConditionalRender condition={isOwner}>
                            <CustomButton
                                className={styles.doNotDisturbBtn}
                                onClick={handleDoNotDisturb}
                            >
                                <CustomGrid
                                    container
                                    justifyContent="space-between"
                                    alignItems="center"
                                    fontSize="18px"
                                >
                                    <Translation
                                        nameSpace="meeting"
                                        translation="templates.doNotDisturb.title"
                                    />
                                    <Translation
                                        nameSpace="meeting"
                                        translation={!doNotDisturbStore ? "templates.doNotDisturb.off" : "templates.doNotDisturb.on"}
                                    />
                                    <FiberManualRecordIcon sx={{ color: !doNotDisturbStore ? '#3CD742' : 'red' }} />
                                </CustomGrid>
                            </CustomButton>
                        </ConditionalRender>
                    </CustomGrid>
                </CustomScroll>
            </CustomGrid>
        </FormProvider>
    );
};
