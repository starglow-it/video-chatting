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

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { PaymentForm } from '@components/PaymentForm/PaymentForm';

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
    createPaymentIntentFx,
    paywallPrePaymentEvent,
    updateLocalUserEvent,
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
    const [isPreviewShow, setIsPreviewShow] = useState(true);
    const aboutTheHost = meetingTemplate !== null &&
        meetingTemplate.meetingInstance !== null &&
        meetingTemplate.meetingInstance.hasOwnProperty('startAt') ? meetingTemplate.meetingInstance.aboutTheHost : '';

    const { isMobile } = useBrowserDetect();

    const router = useRouter();

    const handleGoBack = useCallback(() => {
        Router.back();
    }, [router]);

    const roleQuery = router.query.role as string;
    const meetingRole = !!roleQuery ? MeetingRole.Audience : MeetingRole.Participant;

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

    // const handleDownloadInviteICSFile = async () => {
    //     if (!!meetingTemplate.id && !!meetingTemplate.meetingInstance.content) {
    //         await downloadIcsFileFx({
    //             templateId: meetingTemplate.id,
    //             content: meetingTemplate.meetingInstance.content
    //         });
    //     }
    // };

    const handleEnterMeeting = () => {
        if ((enabledPaymentPaywallParticipant || enabledPaymentPaywallAudience) && !localUserStore.isPaywallPaid) {
            setIsPreviewShow(false);
        } else {
            handleSetMeetingPreviewShow();
        }
    };

    const handlePaywallPrepayment = () => {
        paywallPrePaymentEvent();
        updateLocalUserEvent({ ...localUserStore, isPaywallPaid: true });
        handleSetMeetingPreviewShow();
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
                            width={isMobile ? '50px' : '120px'}
                            height={isMobile ? '50px' : '120px'}
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
                            <CustomGrid
                                container
                                gap={4}
                                flexWrap="nowrap"
                                justifyContent="center"
                                className={styles.buttonsGroup}
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
                                    <ActionButton
                                        variant="accept"
                                        label="Enter"
                                        className={styles.actionButton}
                                        onAction={handleEnterMeeting}
                                    />
                                </CustomGrid>
                            </CustomGrid>
                        </CustomGrid>
                    </CustomGrid>
                </ConditionalRender>
                <ConditionalRender condition={!isPreviewShow && (enabledPaymentPaywallParticipant || enabledPaymentPaywallAudience)}>
                    <ConditionalRender condition={enabledPaymentPaywallParticipant && meetingRole === MeetingRole.Participant}>
                        <CustomPaper className={styles.payPaper}>
                            <PaymentForm
                                isPreEvent={true}
                                onClose={() => { }}
                                payment={paymentPaywallParticipant}
                                setMeetingPreviewShow={handlePaywallPrepayment}
                            />
                        </CustomPaper>
                    </ConditionalRender>
                    <ConditionalRender condition={enabledPaymentPaywallAudience && meetingRole === MeetingRole.Audience}>
                        <CustomGrid
                            item
                            container
                            className={styles.outterPayPaper}
                        >
                            <CustomPaper className={styles.innerPayPaper}>
                                <PaymentForm
                                    isPreEvent={true}
                                    onClose={() => { }}
                                    payment={paymentPaywallAudience}
                                    setMeetingPreviewShow={handlePaywallPrepayment}
                                />
                            </CustomPaper>
                        </CustomGrid>
                    </ConditionalRender>
                </ConditionalRender>
            </ConditionalRender>
        </CustomGrid>
    );
};

export const MeetingPreEvent = memo(Component);
