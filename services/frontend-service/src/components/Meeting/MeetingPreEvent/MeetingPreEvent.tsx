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
import { ActionButton } from 'shared-frontend/library/common/ActionButton';

// components
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { PaymentForm } from '@components/PaymentForm/PaymentForm';

//const
import { PaymentType } from 'shared-const';
import { MeetingRole } from 'shared-types';

//helper
import { parseCustomDateString } from '../../../helpers/parseCustomDateString';

import {
    downloadIcsFileFx
} from '../../../store';

import {
    $isOwner,
    $meetingTemplateStore,
    $paymentMeetingParticipant,
    $isRoomPaywalledStore,
    createPaymentIntentFx,

} from '../../../store/roomStores';

// styles
import styles from './MeetingPreEvent.module.scss';

// const
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

const timeDifference = (targetDate: string | undefined): boolean => {
    if (targetDate) {
        const now = new Date();
        const target = new Date(targetDate);
        const timeDifference = target - now;
        const minutesDifference = Math.floor(timeDifference / (1000 * 60));
        return minutesDifference < 60;
    } else return false;
}

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
    const isRoomPaywalledStore = useStore($isRoomPaywalledStore);
    const startMeetingAt =
        meetingTemplate !== null &&
            meetingTemplate.meetingInstance !== null &&
            meetingTemplate.meetingInstance.hasOwnProperty('startAt') ? parseCustomDateString(meetingTemplate.meetingInstance.startAt)?.formattedDate : '';
    const isMeetingStartWithInFiveMin = timeDifference(parseCustomDateString(meetingTemplate.meetingInstance.startAt)?.formattedDateWithYear);
    const aboutTheHost = meetingTemplate !== null &&
        meetingTemplate.meetingInstance !== null &&
        meetingTemplate.meetingInstance.hasOwnProperty('startAt') ? meetingTemplate.meetingInstance.aboutTheHost : '';

    const { isMobile } = useBrowserDetect();

    const router = useRouter();

    const handleGoBack = useCallback(() => {
        Router.back();
    }, [router]);

    const paymentMeetingParticipant = useStore($paymentMeetingParticipant);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const meetingRole = !!router.query.role ? MeetingRole.Audience : MeetingRole.Participant;

                if (isRoomPaywalledStore) {
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
    }, [meetingTemplate.id, meetingTemplate.type, isRoomPaywalledStore]);

    const handleDownloadInviteICSFile = async () => {
        if (!!meetingTemplate.id && !!meetingTemplate.meetingInstance.content) {
            await downloadIcsFileFx({
                templateId: meetingTemplate.id,
                content: meetingTemplate.meetingInstance.content
            });
        }
    };

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
                            {startMeetingAt}
                        </CustomTypography>
                        <CustomTypography
                            variant="h6"
                            color="colors.white.primary"
                            nameSpace="createRoom"
                            translation="editDescription.form.description"
                            className={clsx(styles.descriptionLabel, {
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
                            className={clsx(styles.descriptionLabel, {
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
                        <ConditionalRender condition={isRoomPaywalledStore}>
                            <CustomPaper className={styles.payPaper}>
                                <CustomTypography
                                    variant="body2bold"
                                    nameSpace="createRoom"
                                    translation="editDescription.form.paymentTitle"
                                    className={styles.paymentTitle}
                                />
                                <PaymentForm
                                    isPreEvent={true}
                                    onClose={() => { }}
                                    payment={paymentMeetingParticipant}
                                    setMeetingPreviewShow={handleSetMeetingPreviewShow}
                                />
                            </CustomPaper>
                        </ConditionalRender>
                        <ConditionalRender condition={!isRoomPaywalledStore}>
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
                                        label={isMeetingStartWithInFiveMin ? 'Join Now' : 'add to Calendar'}
                                        className={styles.actionButton}
                                        onAction={() =>
                                            isMeetingStartWithInFiveMin
                                                ? handleSetMeetingPreviewShow()
                                                : handleDownloadInviteICSFile()
                                        }
                                    />
                                    {!isMeetingStartWithInFiveMin &&
                                        <CustomTypography
                                            variant="body3"
                                            nameSpace="createRoom"
                                            translation="editDescription.form.preMeetingNtfText"
                                            className={clsx(styles.preMeetingNtfText, {
                                                [styles.mobile]: isMobile
                                            })}
                                        />
                                    }
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
