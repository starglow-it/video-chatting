import { memo, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';

//Custom components
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomScroll } from '@library/custom/CustomScroll/CustomScroll';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { ProfileAvatar } from '@components/Profile/ProfileAvatar/ProfileAvatar';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { PaymentForm } from '@components/PaymentForm/PaymentForm';

//store
import {
    $isMeetingSocketConnected,
    $sharedRecordingVideoStore,
    getRecordingVideo,
    getRecordingUrl,
    initiateMeetingSocketConnectionFx,
    createPaymentIntentFxForRecordingVideo,
    cancelPaymentIntentWithData
} from '../../store/roomStores';

//helpers
import formatDate from '../../helpers/formatDate';
import calDiffOfTimes from '../../helpers/calDiffOfTimes';

//const
import { DEFAULT_PAYMENT_CURRENCY, PaymentType } from 'shared-const';
import { MeetingRole } from 'shared-types';

//icon
import StarIcon from '@mui/icons-material/Star';

//scss
import styles from './RecordingVideoContainer.module.scss';

const RecordingVideoContainer = () => {
    const router = useRouter();
    const isMeetingSocketConnected = useStore($isMeetingSocketConnected);
    const sharedRecordingVideoStore = useStore($sharedRecordingVideoStore);
    const [paymentData, setPaymentData] = useState<boolean>({
        enabled: false,
        price: 0,
        type: PaymentType.Paywall,
        meetingRole: MeetingRole.Audience,
        currency: DEFAULT_PAYMENT_CURRENCY
    });
    const token = router.query.token;

    useEffect(() => {
        (async () => {
            await initiateMeetingSocketConnectionFx({ isStatistics: true });
        })();

        return () => {
            if (paymentData.enabled) {
                cancelPaymentIntentWithData();
            }
        }
    }, []);

    useEffect(() => {
        if (!!token && isMeetingSocketConnected) {
            getRecordingVideo({ id: token });
        }
    }, [token, isMeetingSocketConnected]);

    useEffect(() => {
        (async () => {
            if (sharedRecordingVideoStore.id && sharedRecordingVideoStore.price === 0) {
                getRecordingUrl({ id: sharedRecordingVideoStore.id });
            }

            if (sharedRecordingVideoStore.host.id && sharedRecordingVideoStore.price > 0) {
                await createPaymentIntentFxForRecordingVideo({ userId: sharedRecordingVideoStore.host.id, price: sharedRecordingVideoStore.price });
                setPaymentData(prevData => ({ ...prevData, enabled: true, price: sharedRecordingVideoStore.price }));
            }
        })();
    }, [sharedRecordingVideoStore.id, sharedRecordingVideoStore.host, sharedRecordingVideoStore.price]);

    const handleCloseForm = () => {
        setPaymentData(prevData => ({ ...prevData, enabled: false }));
        cancelPaymentIntentWithData();
        if (sharedRecordingVideoStore.id) {
            getRecordingUrl({ id: sharedRecordingVideoStore.id });
        }
    };

    const renderedVideo = () => {
        return (
            <>
                <CustomGrid
                    item
                    marginBottom={1}
                >
                    <CustomTypography
                        variant="body1bold"
                        nameSpace="profile"
                        translation="sharedRecordingVideo.meetingName"
                        color="#BDC8D3"
                    />
                    <CustomTypography
                        variant="body1"
                        marginLeft={1}
                    >
                        {sharedRecordingVideoStore.meetingName}
                    </CustomTypography>
                </CustomGrid>
                <CustomGrid
                    item
                    marginBottom={1}
                >
                    <CustomTypography
                        variant="body1bold"
                        nameSpace="profile"
                        translation="sharedRecordingVideo.date"
                        color="#BDC8D3"
                    />
                    <CustomTypography
                        variant="body1"
                        marginLeft={1}
                    >
                        {formatDate(sharedRecordingVideoStore.createdAt)}
                    </CustomTypography>
                </CustomGrid>
                <CustomGrid
                    item
                    marginBottom={1}
                >
                    <CustomTypography
                        variant="body1bold"
                        nameSpace="profile"
                        translation="sharedRecordingVideo.duration"
                        color="#BDC8D3"
                    />
                    <CustomTypography
                        variant="body1"
                        marginLeft={1}
                    >
                        {`${calDiffOfTimes(sharedRecordingVideoStore.createdAt, sharedRecordingVideoStore.endAt)}
                        ${calDiffOfTimes(sharedRecordingVideoStore.createdAt, sharedRecordingVideoStore.endAt) > 1
                                ? 'mins' : 'min'}`}
                    </CustomTypography>
                </CustomGrid>
                <CustomGrid
                    item
                    marginBottom={1}
                >
                    <CustomTypography
                        variant="body1bold"
                        nameSpace="profile"
                        translation="sharedRecordingVideo.url"
                        color="#BDC8D3"
                    />
                    {
                        !!sharedRecordingVideoStore.url
                            ? <CustomTypography
                                variant="body1"
                                marginLeft={1}
                            >
                                <a href={sharedRecordingVideoStore.url} target='_blank' >{sharedRecordingVideoStore.url}</a>
                            </CustomTypography>
                            : <CustomTypography
                                variant="body2"
                                nameSpace="profile"
                                translation="sharedRecordingVideo.isNotPaid"
                                marginLeft={1}
                                color="red"
                            />
                    }
                </CustomGrid>
            </>
        );
    };

    return (
        <CustomScroll>
            <CustomGrid
                container
                flexDirection="column"
                alignItems="center"
                justifyContent="flex-start"
                className={styles.wrapper}
                gap={4}
            >
                <CustomPaper className={styles.paper}>
                    <CustomGrid
                        container
                        justifyContent="flex-start"
                        className={styles.aboutHostWrapper}
                    >
                        <ProfileAvatar
                            className={styles.profileImage}
                            width="90px"
                            height="90px"
                            src={''}
                            userName={'Admin'}
                        />
                        <CustomGrid
                            item
                            container
                            flexDirection="column"
                            alignItems="flex-start"
                            justifyContent="center"
                            gap={1.5}
                            className={styles.hostDescription}
                        >
                            <CustomTypography variant="h4bold">{sharedRecordingVideoStore.host.fullName}</CustomTypography>
                            <CustomTypography variant="body2">{sharedRecordingVideoStore.host.email}</CustomTypography>
                        </CustomGrid>
                    </CustomGrid>
                </CustomPaper>
                <CustomPaper className={styles.paper}>
                    <CustomGrid
                        container
                        gap={1.5}
                        marginBottom={2}
                    >
                        <StarIcon
                            className={styles.favoriteIcon}
                            width="24px"
                            height="24px"
                        />
                        <CustomTypography
                            variant="body1bold"
                            fontWeight="600"
                            nameSpace="profile"
                            translation="sharedRecordingVideo.title"
                        />
                    </CustomGrid>
                    <CustomGrid
                        container
                        flexDirection="column"
                        gap={1}
                    >
                        {renderedVideo()}
                        <CustomGrid
                            item
                            container

                        >
                            {/* integrate stripe payment */}
                            <ConditionalRender
                                condition={paymentData.enabled}
                            >
                                <PaymentForm
                                    onClose={handleCloseForm}
                                    payment={paymentData}
                                />
                            </ConditionalRender>
                        </CustomGrid>
                    </CustomGrid>
                </CustomPaper>
            </CustomGrid>
        </CustomScroll>
    );
};

export default RecordingVideoContainer;