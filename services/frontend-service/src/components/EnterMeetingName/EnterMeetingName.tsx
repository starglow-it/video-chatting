import { memo, useCallback, useEffect, useState } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import clsx from 'clsx';

//types
import { MeetingRole } from 'shared-types';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomLink } from '@library/custom/CustomLink/CustomLink';
import { CustomInput } from '@library/custom/CustomInput/CustomInput';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';

// validation
import { MeetingAccessStatusEnum } from 'shared-types';
import { Translation } from '@library/common/Translation/Translation';
import { useRouter } from 'next/router';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { MeetingPaywall } from '@components/Meeting/MeetingPaywall/MeetingPaywall';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';
import { fullNameSchema } from '../../validation/users/fullName';

// stores
import { $profileStore, $authStore, $isSocketConnected } from '../../store';
import {
    $enabledPaymentPaywallAudience,
    $isLoadingJoinWaitingRoom,
    $isAudience,
    $isMeetingSocketConnected,
    $isMeetingSocketConnecting,
    $isOwner,
    $isOwnerInMeeting,
    $localUserStore,
    $meetingTemplateStore,
    $meetingUsersStore,
    $isOwnerDoNotDisturb,
    $meetingStore,
    $isPaywallPaid,
    getMeetingTemplateFx,
    joinAudienceMeetingSocketEvent,
    joinRecorderMeetingSocketEvent,
    updateLocalUserEvent,
    setIsPaywallPaymentEnabled
} from '../../store/roomStores';

// types

// styles
import styles from './EnterMeetingName.module.scss';

const validationSchema = yup.object({
    fullName: fullNameSchema().required('required'),
});

const Component = () => {
    const { isAuthenticated } = useStore($authStore);
    const router = useRouter();
    const profile = useStore($profileStore);
    const localUser = useStore($localUserStore);
    const meetingTemplate = useStore($meetingTemplateStore);
    const isSocketConnected = useStore($isSocketConnected);
    const isMeetingSocketConnecting = useStore($isMeetingSocketConnecting);
    const isJoinWaitingRoomPending = useStore($isLoadingJoinWaitingRoom);
    const isOwner = useStore($isOwner);
    const isAudience = useStore($isAudience);
    const enabledPaymentPaywallAudience = useStore($enabledPaymentPaywallAudience);
    const isOwnerInMeeting = useStore($isOwnerInMeeting);
    const isMeetingSocketConnected = useStore($isMeetingSocketConnected);
    const isOwnerDoNotDisturb = useStore($isOwnerDoNotDisturb);
    const isPaywallPaid = useStore($isPaywallPaid);
    const meetingStore = useStore($meetingStore);
    const isHasMeeting = useStoreMap({
        store: $meetingUsersStore,
        keys: [],
        fn: state =>
            state.some(
                user => user.accessStatus === MeetingAccessStatusEnum.InMeeting,
            ),
    });
    const isLoadingFetchMeeting = useStore(getMeetingTemplateFx.pending);

    const nameOnUrl = router.query?.participantName as string | undefined;
    const resolver = useYupValidationResolver<{
        fullName: string;
    }>(validationSchema);

    const { isMobile } = useBrowserDetect();
    const [isJoinPaywall, setIsJoinPaywall] = useState(false);
    const roleUrl = router.query.role as string;
    const isRecorder = roleUrl === MeetingRole.Recorder;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            fullName: isOwner
                ? meetingTemplate.fullName
                : nameOnUrl || localUser.username || profile.fullName,
        },
    });

    const fullNameRegister = register('fullName');

    const onSubmit = useCallback(
        handleSubmit(data => {
            if (isRecorder) {
                updateLocalUserEvent({
                    username: 'recorder',
                });
                joinRecorderMeetingSocketEvent();
            }

            if (isAudience) {
                if (!isOwnerDoNotDisturb) {
                    updateLocalUserEvent({
                        username: data.fullName,
                    });
                    if (enabledPaymentPaywallAudience && !isPaywallPaid) {
                        setIsJoinPaywall(true);
                    } else {
                        joinAudienceMeetingSocketEvent();
                    }
                } else {
                    updateLocalUserEvent({
                        username: data.fullName,
                        accessStatus: MeetingAccessStatusEnum.Waiting
                    });
                }
            } else {
                updateLocalUserEvent({
                    username: data.fullName,
                    accessStatus: MeetingAccessStatusEnum.Settings,
                });
            }
        }),
        [enabledPaymentPaywallAudience, isAudience, isOwnerDoNotDisturb, roleUrl],
    );

    const handlePaymentSuccess = useCallback(() => {
        setIsPaywallPaymentEnabled(true);
        joinAudienceMeetingSocketEvent();
    }, []);

    const fullNameError = errors.fullName?.message;

    useEffect(() => {
        if (nameOnUrl && !isRecorder) {
            updateLocalUserEvent({
                username: nameOnUrl,
                accessStatus: MeetingAccessStatusEnum.Settings,
            });
        }
    }, []);

    useEffect(() => {
        if (isRecorder && !!meetingStore.id) {
            updateLocalUserEvent({
                username: 'recorder',
            });
            joinRecorderMeetingSocketEvent();
        }
    }, [meetingStore]);

    const EnterNameElement = (
        <>
            <CustomTypography
                variant="h3bold"
                nameSpace="meeting"
                textAlign={isMobile ? 'center' : 'left'}
                translation="enterName.title"
            />
            <CustomGrid container direction="column" flex="1 1 auto">
                <CustomGrid
                    container
                    justifyContent={isMobile ? 'center' : 'left'}
                >
                    <CustomTypography
                        className={styles.title}
                        nameSpace="meeting"
                        translation="enterName.text.part1"
                    />
                    {!isAuthenticated && (
                        <>
                            &nbsp;
                            <CustomTypography
                                nameSpace="meeting"
                                translation="enterName.text.part2"
                            />
                            &nbsp;
                            <CustomLink
                                href="/login"
                                nameSpace="meeting"
                                translation="enterName.text.part3"
                            />
                            &nbsp;
                            <CustomTypography
                                nameSpace="meeting"
                                translation="enterName.text.part4"
                            />
                        </>
                    )}
                </CustomGrid>

                <form onSubmit={onSubmit} className={styles.formContent}>
                    <CustomInput
                        nameSpace="forms"
                        translation="yourName"
                        autoComplete="given-name"
                        onChange={fullNameRegister.onChange}
                        onBlur={fullNameRegister.onBlur}
                        ref={fullNameRegister.ref}
                        name={fullNameRegister.name}
                        error={fullNameError}
                    />
                    <CustomButton
                        disabled={
                            !isSocketConnected ||
                            isMeetingSocketConnecting ||
                            isJoinWaitingRoomPending
                        }
                        className={clsx(styles.button, {
                            [styles.mobile]: isMobile,
                        })}
                        type="submit"
                        label={
                            <Translation
                                nameSpace="meeting"
                                translation={
                                    isAudience
                                        ? 'buttons.join'
                                        : 'buttons.continue'
                                }
                            />
                        }
                    />
                </form>
            </CustomGrid>
        </>
    );

    const renderEnterName = () => {
        if (
            isLoadingFetchMeeting ||
            !isMeetingSocketConnected ||
            isJoinWaitingRoomPending
        ) {
            return <CustomLoader className={styles.loader} />;
        }
        if (isAudience) {
            if (!isHasMeeting) {
                return (
                    <CustomTypography
                        variant="h3bold"
                        nameSpace="meeting"
                        textAlign="center"
                        translation="meetingHasEnded"
                    />
                );
            }
            if (!meetingTemplate.isPublishAudience) {
                return (
                    <CustomTypography
                        variant="h3bold"
                        nameSpace="meeting"
                        textAlign="center"
                        translation="meetingPrivate"
                    />
                );
            }
            if (!isOwnerInMeeting) {
                return (
                    <CustomTypography
                        variant="h3bold"
                        nameSpace="meeting"
                        textAlign="center"
                        translation="waitForTheHost"
                    />
                );
            }
            return EnterNameElement;
        }
        return EnterNameElement;
    };

    return (
        <CustomGrid
            container
            direction="column"
            className={clsx({
                [styles.contentWrapper]: isMobile,
            })}
        >
            <ConditionalRender condition={!isJoinPaywall && !isRecorder}>
                {renderEnterName()}
            </ConditionalRender>
            <ConditionalRender condition={isJoinPaywall}>
                <MeetingPaywall onPaymentSuccess={handlePaymentSuccess} />
            </ConditionalRender>
        </CustomGrid>
    );
};

export const EnterMeetingName = memo(Component);
