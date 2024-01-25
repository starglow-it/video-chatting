import { memo, useCallback, useEffect } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import Router, { useRouter } from 'next/router';


// hooks
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomInput } from 'shared-frontend/library/custom/CustomInput';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { StripeElement } from '@components/Stripe/StripeElement/StripeElement';
import { CardDataForm } from '@components/Payments/CardDataForm/CardDataForm';
import { PaymentForm } from '@components/PaymentForm/PaymentForm';

//const
import { PaymentType } from 'shared-const';

import {
    $isOwner,
    $paymentIntent,
    $localUserStore,
    $meetingTemplateStore,
    $paymentMeetingParticipant,
    createPaymentIntentWithData
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

    const { isMobile } = useBrowserDetect();

    const router = useRouter();

    const handleGoBack = useCallback(() => {
        Router.back();
    }, [router]);

    const paymentMeetingParticipant = useStore($paymentMeetingParticipant);
    const paymentIntent = useStore($paymentIntent);
    const localUserStore = useStore($localUserStore);

    useEffect(() => {
        console.log(paymentIntent);
        console.log(localUserStore);
    }, [paymentIntent, localUserStore]);

    useEffect(() => {
        createPaymentIntentWithData({
            paymentType: PaymentType.Paywall
        });
    }, []);

    return (
        <CustomGrid width="100%">
            <ConditionalRender condition={isShow}>
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
                            className={styles.companyName}
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
                            className={styles.companyName}
                            fontSize={isMobile ? 18 : 30}
                            lineHeight={isMobile ? '20px' : '36px'}
                        >
                            {meetingTemplate.name}
                        </CustomTypography>
                        <CustomTypography
                            variant="body1"
                            color="colors.white.primary"
                            className={styles.companyName}
                            fontSize={isMobile ? 18 : 30}
                            lineHeight={isMobile ? '24px' : '44px'}
                        >
                            {/* {meetingTemplate.name} */}
                            Thursday 10 May 14:00 PST
                        </CustomTypography>
                        <CustomTypography
                            variant="h6"
                            color="colors.white.primary"
                            nameSpace="createRoom"
                            translation="editDescription.form.description"
                            className={styles.descriptionLabel}
                        />
                        <CustomTypography
                            variant="body1"
                            textAlign="center"
                            color="colors.white.primary"
                            className={styles.description}
                            fontSize={isMobile ? 12 : 16}
                            lineHeight={isMobile ? '18px' : '24px'}
                        >
                            {meetingTemplate.shortDescription ||
                                meetingTemplate.description}
                        </CustomTypography>
                        <CustomTypography
                            variant="h6"
                            color="colors.white.primary"
                            className={styles.descriptionLabel}
                        >about {meetingTemplate.companyName}</CustomTypography>
                        <CustomTypography
                            variant="body1"
                            textAlign="center"
                            color="colors.white.primary"
                            className={styles.description}
                            fontSize={isMobile ? 12 : 16}
                            lineHeight={isMobile ? '18px' : '24px'}
                        >
                            {meetingTemplate.description}
                        </CustomTypography>
                        <ConditionalRender condition={meetingTemplate.type !== 'free' || true}>
                            <CustomPaper className={styles.payPaper}>
                                <CustomTypography
                                    variant="body2bold"
                                    nameSpace="createRoom"
                                    translation="editDescription.form.paymentTitle"
                                    className={styles.paymentTitle}
                                />
                                <CustomTypography
                                    variant="body3"
                                    className={styles.paymentDescription}
                                >Please Pay <b>$3 &middot;</b> per session</CustomTypography>
                                <hr />
                                <CustomTypography
                                    variant="body3bold"
                                    nameSpace="createRoom"
                                    translation="editDescription.form.yourCard"
                                    className={styles.yourCardTitle}
                                />
                                <CustomGrid container className={styles.cardDetail}>
                                    <PaymentForm
                                        onClose={() => {}}
                                        payment={paymentMeetingParticipant}
                                    />
                                </CustomGrid>
                                <CustomButton
                                    onClick={() => { }}
                                    className={clsx(styles.addLinkButton)}
                                    label={
                                        <CustomTypography
                                            variant="body3"
                                            className={styles.secureWithStripeText}
                                        >
                                            <CustomTypography
                                                variant="body3bold"
                                                className={styles.stripeIcon}
                                            >S</CustomTypography>
                                            Secure Pay with <b> Stripe</b>
                                        </CustomTypography>
                                    }
                                />
                            </CustomPaper>
                        </ConditionalRender>
                        <ConditionalRender condition={meetingTemplate.type === 'free' && false}>
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
                                        label="Join Now"
                                        className={styles.actionButton}
                                        onAction={() => handleSetMeetingPreviewShow()}
                                    />
                                    <CustomTypography
                                        variant="body3"
                                        nameSpace="createRoom"
                                        translation="editDescription.form.preMeetingNtfText"
                                        className={styles.preMeetingNtfText}
                                    />
                                </CustomGrid>
                            </CustomGrid>

                        </ConditionalRender>
                    </CustomGrid>
                </CustomGrid>
            </ConditionalRender>
        </CustomGrid>
    );
};

export const MeetingPreEvent = memo(Component);
