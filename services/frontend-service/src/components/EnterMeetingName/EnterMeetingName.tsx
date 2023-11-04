import { memo, useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import clsx from 'clsx';

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
import { fullNameSchema } from '../../validation/users/fullName';

// stores
import { $profileStore, $authStore, $isSocketConnected } from '../../store';
import {
    $enabledPaymentPaywallLurker,
    $isLurker,
    $isMeetingSocketConnecting,
    $isOwner,
    $localUserStore,
    $meetingTemplateStore,
    joinLurkerMeetingSocketEvent,
    sendJoinWaitingRoomSocketEvent,
    updateLocalUserEvent,
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
    const isJoinWaitingRoomPending = useStore(
        sendJoinWaitingRoomSocketEvent.pending,
    );
    const isOwner = useStore($isOwner);
    const isLurker = useStore($isLurker);
    const enabledPaymentPaywallLurker = useStore($enabledPaymentPaywallLurker);
    const nameOnUrl = router.query?.participantName as string | undefined;
    const resolver = useYupValidationResolver<{
        fullName: string;
    }>(validationSchema);

    const { isMobile } = useBrowserDetect();
    const [isJoinPaywall, setIsJoinPaywall] = useState(false);

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
            if (isLurker) {
                updateLocalUserEvent({
                    username: data.fullName,
                });
                if (enabledPaymentPaywallLurker) {
                    setIsJoinPaywall(true);
                } else {
                    joinLurkerMeetingSocketEvent();
                }
            } else {
                updateLocalUserEvent({
                    username: data.fullName,
                    accessStatus: MeetingAccessStatusEnum.Settings,
                });
            }
        }),
        [enabledPaymentPaywallLurker, isLurker],
    );

    const handlePaymentSuccess = useCallback(() => {
        joinLurkerMeetingSocketEvent();
        // setIsJoinPaywall(false);
    }, []);

    const fullNameError = errors.fullName?.message;

    useEffect(() => {
        if (nameOnUrl) {
            updateLocalUserEvent({
                username: nameOnUrl,
                accessStatus: MeetingAccessStatusEnum.Settings,
            });
        }
    }, []);

    return (
        <CustomGrid
            container
            direction="column"
            className={clsx({
                [styles.contentWrapper]: isMobile,
            })}
        >
            <ConditionalRender condition={!isJoinPaywall}>
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
                                        isLurker
                                            ? 'buttons.join'
                                            : 'buttons.continue'
                                    }
                                />
                            }
                        />
                    </form>
                </CustomGrid>
            </ConditionalRender>
            <ConditionalRender condition={isJoinPaywall}>
                <MeetingPaywall onPaymentSuccess={handlePaymentSuccess} />
            </ConditionalRender>
        </CustomGrid>
    );
};

export const EnterMeetingName = memo(Component);
