import { memo, useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import Router, { useRouter } from 'next/router';

// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { PreEventPaymentForm } from '@components/PreEventPaymentForm/PreEventPaymentForm';

//const
import { PaymentType } from 'shared-const';
import { MeetingRole } from 'shared-types';

import {
    $isOwner,
    $meetingTemplateStore,
    $enabledPaymentPaywallParticipant,
    $enabledPaymentPaywallAudience,
    $paymentPaywallParticipant,
    $paymentPaywallAudience,
    $localUserStore,
    $isOwnerInMeeting,
    $doNotDisturbStore,
    $isLoadingJoinWaitingRoom,
    $meetingRoleStore,
    $preEventPaymentCodeCheckStore,
    createPaymentIntentFx,
    updateLocalUserEvent,
    sendJoinWaitingRoomSocketEvent
} from '../../../store/roomStores';

// styles
import styles from './MeetingPreEvent.module.scss';

// const
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

const Component = ({
    isAllowBack = true,
    isShow = true,
    handleSetMeetingPreviewShow
}: {
    isAllowBack: Boolean,
    isShow: boolean,
    handleSetMeetingPreviewShow: () => void
}) => {
    const meetingTemplate = useStore($meetingTemplateStore);
    const isOwner = useStore($isOwner);
    const enabledPaymentPaywallParticipant = useStore($enabledPaymentPaywallParticipant);
    const enabledPaymentPaywallAudience = useStore($enabledPaymentPaywallAudience);
    const paymentPaywallParticipant = useStore($paymentPaywallParticipant);
    const paymentPaywallAudience = useStore($paymentPaywallAudience);
    const localUserStore = useStore($localUserStore);
    const isJoinWaitingRoomPending = useStore($isLoadingJoinWaitingRoom);
    const [isPreviewShow, setIsPreviewShow] = useState(true);
    const aboutTheHost = meetingTemplate !== null &&
        meetingTemplate.meetingInstance !== null &&
        meetingTemplate.meetingInstance.hasOwnProperty('startAt') ? meetingTemplate.meetingInstance.aboutTheHost : '';
    const isOwnerInMeeting = useStore($isOwnerInMeeting);
    const doNotDisturb = useStore($doNotDisturbStore);
    const meetingRole = useStore($meetingRoleStore);
    const preEventPaymentCodeCheck = useStore($preEventPaymentCodeCheckStore);

    const { isMobile } = useBrowserDetect();

    const router = useRouter();

    const handleGoBack = useCallback(() => {
        Router.back();
    }, [router]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (enabledPaymentPaywallParticipant || enabledPaymentPaywallAudience) {
                    await createPaymentIntentFx({
                        templateId: meetingTemplate.id,
                        meetingRole: meetingRole,
                        paymentType: PaymentType.Paywall
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [meetingTemplate.id, enabledPaymentPaywallParticipant, enabledPaymentPaywallAudience, meetingRole]);

    const handleEnterMeeting = () => {
        if (
            (enabledPaymentPaywallParticipant || enabledPaymentPaywallAudience) &&
            (!isOwnerInMeeting || doNotDisturb || !localUserStore.isPaywallPaid)
        ) {
            setIsPreviewShow(false);
        } else {
            handleSetMeetingPreviewShow();
        }
    };

    const handlePaywallPrepayment = () => {
        if (!localUserStore.isPaywallPaid) {
            updateLocalUserEvent({ ...localUserStore, isPaywallPaid: true });
        }
        if (preEventPaymentCodeCheck === 'success') {
            handleSetMeetingPreviewShow();
        }

        let meetingUserIds = localStorage.getItem('meetingUserIds');
        let parsedMeetingUserIds = meetingUserIds && Array.isArray(JSON.parse(meetingUserIds)) ? [...JSON.parse(meetingUserIds)] : [];

        if (!!localUserStore.id && parsedMeetingUserIds.findIndex(item => item.id === localUserStore.id) === -1) {
            parsedMeetingUserIds.push({ id: localUserStore.id, date: new Date() });
            localStorage.setItem('meetingUserIds', JSON.stringify(parsedMeetingUserIds));
        }
    };

    return (
        <CustomGrid width="100%">
            <ConditionalRender condition={isShow}>
                <ConditionalRender condition={isPreviewShow}>
                    <CustomGrid
                        container
                        alignItems="center"
                        className={clsx(styles.meetingPreviewWrapper, {
                            [styles.mobile]: isMobile,
                        })}
                        wrap="nowrap"
                    >
                        <CustomBox className={styles.imageWrapper} />
                        <ProfileAvatar
                            className={clsx(styles.profileAvatar, {
                                [styles.mobile]: isMobile,
                            })}
                            width={isMobile ? '50px' : '100px'}
                            height={isMobile ? '50px' : '100px'}
                            src={meetingTemplate?.user?.profileAvatar?.url || ''}
                            userName={meetingTemplate.fullName}
                        />
                        <CustomGrid
                            item
                            container
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            className={styles.textWrapper}
                            flex="1 1 auto"
                        >
                            <CustomTypography
                                variant="h3"
                                color="colors.white.primary"
                                className={styles.titleText}
                                fontSize={isMobile ? 15 : 20}
                                lineHeight={isMobile ? '20px' : '36px'}
                            >
                                {meetingTemplate.companyName}
                            </CustomTypography>
                            <ConditionalRender condition={!isOwner}>
                                <CustomTypography
                                    textAlign="center"
                                    color="colors.white.primary"
                                    nameSpace="meeting"
                                    translation="preview.invitedText"
                                    fontSize={isMobile ? 12 : 14}
                                    lineHeight={isMobile ? '18px' : '24px'}
                                    className={styles.invitedText}
                                />
                            </ConditionalRender>
                            <CustomTypography
                                variant="h3bold"
                                color="colors.white.primary"
                                className={clsx(styles.titleText, styles.roomName)}
                                fontSize={isMobile ? 18 : 30}
                                lineHeight={isMobile ? '20px' : '36px'}
                            >
                                {meetingTemplate.name}
                            </CustomTypography>
                            <CustomTypography
                                variant="h6"
                                color="colors.white.primary"
                                nameSpace="createRoom"
                                translation="editDescription.form.description"
                                className={clsx(styles.formLabel, styles.descriptionLabel, {
                                    [styles.mobile]: isMobile
                                })}
                            />
                            <CustomTypography
                                variant="body1"
                                textAlign="center"
                                color="colors.white.primary"
                                className={clsx(styles.description, {
                                    [styles.mobile]: isMobile
                                })}
                                fontSize={isMobile ? 12 : 16}
                                lineHeight={isMobile ? '18px' : '24px'}
                            >
                                {meetingTemplate.shortDescription ||
                                    meetingTemplate.description}
                            </CustomTypography>
                            <CustomTypography
                                variant="h6"
                                color="colors.white.primary"
                                className={clsx(styles.formLabel, {
                                    [styles.mobile]: isMobile
                                })}
                            >about {meetingTemplate.companyName}</CustomTypography>
                            <CustomTypography
                                variant="body1"
                                textAlign="center"
                                color="colors.white.primary"
                                className={clsx(styles.description, {
                                    [styles.mobile]: isMobile
                                })}
                                fontSize={isMobile ? 12 : 16}
                                lineHeight={isMobile ? '18px' : '24px'}
                            >
                                {aboutTheHost}
                            </CustomTypography>
                            <ConditionalRender condition={!isOwnerInMeeting || doNotDisturb}>
                                <CustomGrid
                                    container
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    gap={0.5}
                                    className={styles.preEventText}
                                >
                                    <CustomTypography
                                        nameSpace="meeting"
                                        translation="preview.preEventText1"
                                    />
                                    <CustomTypography
                                        nameSpace="meeting"
                                        translation="preview.preEventText2"
                                    />
                                </CustomGrid>
                            </ConditionalRender>
                            <CustomGrid
                                container
                                gap={4}
                                flexWrap="nowrap"
                                justifyContent="center"
                                className={clsx(styles.buttonsGroup, { [styles.enterBtn]: isOwnerInMeeting && !doNotDisturb })}
                            >
                                <CustomGrid
                                    item
                                    xs
                                    container
                                    justifyContent="flex-end"
                                >
                                    <ActionButton
                                        variant="light-gray"
                                        label="Go Back"
                                        className={styles.actionButton}
                                        onAction={() => handleGoBack()}
                                    />
                                </CustomGrid>
                                <CustomGrid item xs>
                                    {
                                        // !isOwnerInMeeting || doNotDisturb || enabledPaymentPaywallParticipant || enabledPaymentPaywallAudience
                                        enabledPaymentPaywallParticipant || enabledPaymentPaywallAudience
                                            ? <ActionButton
                                                label={isJoinWaitingRoomPending ? <CustomLoader /> : "Pre-pay"}
                                                disabled={isJoinWaitingRoomPending}
                                                className={clsx(styles.actionButton, styles.prePayBtn)}
                                                onAction={handleEnterMeeting}
                                            />
                                            : <ActionButton
                                                variant="accept"
                                                label={isJoinWaitingRoomPending ? <CustomLoader /> : "Enter"}
                                                disabled={isJoinWaitingRoomPending}
                                                className={clsx(styles.actionButton)}
                                                onAction={handleEnterMeeting}
                                            />
                                    }
                                </CustomGrid>
                            </CustomGrid>
                        </CustomGrid>
                    </CustomGrid>
                </ConditionalRender>
                <ConditionalRender condition={!isPreviewShow}>
                    <ConditionalRender condition={meetingRole === MeetingRole.Participant}>
                        <CustomPaper>
                            <PreEventPaymentForm
                                isPaywallPaid={localUserStore.isPaywallPaid}
                                payment={paymentPaywallParticipant}
                                setMeetingPreviewShow={handlePaywallPrepayment}
                            />
                        </CustomPaper>
                    </ConditionalRender>
                    <ConditionalRender condition={meetingRole === MeetingRole.Audience}>
                        <CustomPaper>
                            <PreEventPaymentForm
                                isPaywallPaid={localUserStore.isPaywallPaid}
                                payment={paymentPaywallAudience}
                                setMeetingPreviewShow={handlePaywallPrepayment}
                            />
                        </CustomPaper>
                    </ConditionalRender>
                </ConditionalRender>
            </ConditionalRender>
        </CustomGrid>
    );
};

export const MeetingPreEvent = memo(Component);
