import { memo, useEffect, useState, useRef } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import {
    FieldValues,
    useForm,
} from 'react-hook-form';
import * as yup from 'yup';

//hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';

//types
import { FormDataPayment } from './types';

//custom components
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { Translation } from '@library/common/Translation/Translation';
import { addNotificationEvent } from 'src/store/notifications/model';
import { NotificationType } from 'src/store/types';
import { CustomPopover } from '@library/custom/CustomPopover/CustomPopover';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { ErrorMessage } from '@library/common/ErrorMessage/ErrorMessage';

//fontawesome icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faDollarSign } from '@fortawesome/free-solid-svg-icons'

//store
import { $profileStore } from '../../../store';
import {
    $meetingRecordingStore,
    $isMeetingSocketConnected,
    initiateMeetingSocketConnectionFx,
    deleteRecordingUrlEvent,
    deleteRecordingVideoSocketEvent,
    getRecordingUrls,
    updateRecordingVideoPrice
} from '../../../store/roomStores';
import { MeetingRecordVideo } from '../../../store/types';

//const
import { PlanKeys } from 'shared-types';
import frontendConfig from '../../../const/config';

// @mui
import StarIcon from '@mui/icons-material/Star';
import LinkIcon from '@mui/icons-material/Link';
import { InputBase } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

//helpers
import formatDate from '../../../helpers/formatDate';
import formatRecordingUrls from '../../../helpers/formatRecordingUrl';

//styles
import styles from './RecordingList.module.scss';

const Component = () => {
    const meetingRecordingStore = useStore($meetingRecordingStore);
    const profile = useStore($profileStore);
    const isMeetingSocketConnected = useStore($isMeetingSocketConnected);
    const [isShow, setIsShow] = useState(false);
    const [videos, setVideos] = useState({});
    const [anchor, setAnchor] = useState(null);
    const [monetizationId, setMonetizationId] = useState('');
    const [priceErrorMessage, setPriceErrorMessage] = useState('');
    const parentRef = useRef<any>(null);

    const validationSchema = yup.object({
        price: yup.number().min(0, 'not allowed to negative value.'),
    });

    const resolver =
        useYupValidationResolver<FieldValues>(validationSchema);

    const methods = useForm({
        criteriaMode: 'all',
        resolver,
        defaultValues: {
            price: 0
        } as FormDataPayment,
    });

    const {
        register,
        formState: { errors },
        handleSubmit,
        clearErrors
    } = methods;

    useEffect(() => {
        (async () => {
            await initiateMeetingSocketConnectionFx({ isStatistics: true });
        })();
    }, []);

    useEffect(() => {
        if (isMeetingSocketConnected && profile.id) {
            getRecordingUrls({ profileId: profile.id });
        }
    }, [isMeetingSocketConnected, profile]);

    useEffect(() => {
        if (meetingRecordingStore.videos.length > 0) {
            setVideos(formatRecordingUrls(meetingRecordingStore.videos));
        }
    }, [meetingRecordingStore]);

    useEffect(() => {
        if (profile && profile.subscriptionPlanKey && profile.subscriptionPlanKey !== PlanKeys.House) {
            setIsShow(true);
        }
    }, [profile]);

    useEffect(() => {
        if (errors.price && Array.isArray(errors.price)) {
            if (['min', 'max'].includes(errors.price[0].type.toString() ?? '')) {
                setPriceErrorMessage(errors.price[0].message.toString() ?? '');
            }
        } else {
            setPriceErrorMessage('');
        }
    }, [errors]);

    const copyToClipboard = async (id: string) => {
        const recordingLink = `${frontendConfig.frontendUrl}/recording/${id}`;
        await navigator.clipboard.writeText(recordingLink);
        addNotificationEvent({
            type: NotificationType.copyNotification,
            message: "meeting.copy.url",
            withSuccessIcon: true
        });
    };

    const handleRecordingVideo = (id: string) => {
        deleteRecordingUrlEvent(id);
        deleteRecordingVideoSocketEvent({ id });
    };

    const handleToggleMonetization = (e, id, price) => {
        setMonetizationId(id);
        clearErrors('price');
        methods.reset({ price });
        setAnchor(e.currentTarget);
    };

    const handleCloseMonetization = () => {
        clearErrors('price');
        setAnchor(null)
    };

    const onSubmit = (data) => {
        if (!!monetizationId && typeof data.price === 'number') {
            updateRecordingVideoPrice({ id: monetizationId, price: data.price });
        }

        setAnchor(null);
    };

    const renderedRecordingList = Object.keys(videos).length !== 0
        ? Object.entries(videos).map(([meeting, videos], index) => {
            const videosGrid = videos.map(video => (
                <CustomGrid
                    key={video.id}
                    item
                    container
                    justifyContent="flex-start"
                    alignItems="center"
                    className={styles.videoListItem}
                >
                    <CustomPopover
                        id={`recordingVideo-${video.id}`}
                        open={Boolean(anchor)}
                        onClose={handleCloseMonetization}
                        anchorEl={anchor}
                        container={parentRef.current}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                    >
                        <CustomPaper
                            className={styles.monetizationFormPaper}
                        >
                            <CustomGrid
                                container
                                justifyContent="flex-start"
                                alignItems="center"
                                gap={1}
                            >
                                <CustomTypography className={styles.monetizationIcon}>$</CustomTypography>
                                <CustomTypography
                                    nameSpace="meeting"
                                    translation="recordMeeting.monetizationTitle"
                                    className={styles.monetizationTitle}
                                />
                            </CustomGrid>
                            <CustomGrid
                                container
                                flexDirection="column"
                                gap={1.5}
                            >
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <InputBase
                                        type="number"
                                        placeholder="Amount"
                                        inputProps={{
                                            'aria-label': 'amount',
                                        }}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                $
                                            </InputAdornment>
                                        }
                                        {...register('price')}
                                        classes={{
                                            root: clsx(styles.inputWrapper, { [styles.errorField]: !!priceErrorMessage }),
                                            input: styles.input,
                                        }}
                                        fullWidth
                                    />
                                    <ErrorMessage
                                        error={priceErrorMessage}
                                        className={styles.error}
                                    />
                                    <CustomButton
                                        type="submit"
                                        className={styles.submitBtn}
                                        label={
                                            <Translation
                                                nameSpace="meeting"
                                                translation="recordMeeting.monetizationButtonText"
                                            />
                                        }
                                    />
                                </form>
                            </CustomGrid>
                        </CustomPaper>
                    </CustomPopover>
                    <CustomGrid
                        item
                        xs={6}
                    >
                        <CustomTypography className={styles.recordingTitle}>{formatDate(video.endAt)}</CustomTypography>
                    </CustomGrid>
                    <CustomGrid
                        item
                        xs={6}
                        container
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <CustomGrid
                            item
                            xs={5}
                        >
                            <CustomTypography className={styles.recordingTitle}>${video.price}</CustomTypography>
                        </CustomGrid>
                        <CustomGrid
                            item
                            xs={7}
                            container
                            justifyContent="space-between"
                        >
                            <CustomTooltip
                                title={
                                    <Translation
                                        nameSpace="meeting"
                                        translation="recordMeeting.buttons.monetization"
                                    />
                                }
                                placement="top"
                            >
                                <CustomPaper
                                    variant="black-glass"
                                    className={styles.deviceButton}
                                >
                                    <ActionButton
                                        variant="black"
                                        onAction={e => handleToggleMonetization(e, video.id, video.price)}
                                        className={styles.deviceButton}
                                        Icon={<FontAwesomeIcon icon={faDollarSign} />}
                                    />
                                </CustomPaper>
                            </CustomTooltip>
                            <CustomTooltip
                                title={
                                    <Translation
                                        nameSpace="meeting"
                                        translation="recordMeeting.buttons.copy"
                                    />
                                }
                                placement="top"
                            >
                                <CustomPaper
                                    variant="black-glass"
                                    className={styles.deviceButton}
                                >
                                    <ActionButton
                                        variant="black"
                                        onAction={() => copyToClipboard(video.id)}
                                        className={styles.deviceButton}
                                        Icon={<LinkIcon className={styles.linkIcon} />}
                                    />
                                </CustomPaper>
                            </CustomTooltip>
                            <CustomTooltip
                                title={
                                    <Translation
                                        nameSpace="meeting"
                                        translation="recordMeeting.buttons.delete"
                                    />
                                }
                                placement="top"
                            >
                                <CustomPaper
                                    variant="black-glass"
                                    className={styles.deviceButton}
                                >
                                    <ActionButton
                                        variant="black"
                                        onAction={() => handleRecordingVideo(video.id)}
                                        className={styles.deviceButton}
                                        Icon={<FontAwesomeIcon icon={faTrashCan} />}
                                    />
                                </CustomPaper>
                            </CustomTooltip>
                        </CustomGrid>
                    </CustomGrid>
                </CustomGrid>
            ));
            return (
                <CustomGrid
                    key={`${meeting}-${index}`}
                    item
                    container
                    flexDirection="column"
                    gap={1}
                >
                    <CustomTypography className={styles.meetingName}>{meeting}</CustomTypography>
                    {videosGrid}
                </CustomGrid>

            );
        })
        : <CustomTypography className={styles.recordingTitle}>
            No videos
        </CustomTypography>;

    return (
        <CustomPaper className={styles.personalInfoWrapper}>
            <CustomGrid container marginBottom={2}>
                <StarIcon
                    className={styles.favoriteIcon}
                    width="24px"
                    height="24px"
                />
                <CustomTypography
                    variant="body1"
                    fontWeight="600"
                    nameSpace="profile"
                    translation="recordingList.title"
                />
            </CustomGrid>
            <CustomGrid
                container
                flexDirection="column"
                className={styles.recordingListInnerWrapper}
                gap={1.5}
            >
                {
                    isShow
                        ? renderedRecordingList
                        : <CustomTypography
                            nameSpace="profile"
                            translation="recordingVideos.upgradeNeeded"
                            className={styles.upgradeNeededText}
                            color="error"
                        />
                }
            </CustomGrid>
        </CustomPaper>
    );
};

export const RecordingList = memo(Component);
