import { useStore } from 'effector-react';
import { MouseEvent, MouseEventHandler, memo } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import {
    ACCEPT_MIMES,
    ACCEPT_MIMES_IMAGE,
    ACCEPT_MIMES_VIDEO,
    MAX_SIZE_IMAGE_MB,
    MAX_SIZE_VIDEO_MB,
} from 'shared-const';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MAX_SIZE_IMAGE, MAX_SIZE_VIDEO } from 'src/const/templates/file';
import { $isTrial, $profileStore, addNotificationEvent, getCustomerPortalSessionUrlFx, startCheckoutSessionForSubscriptionFx } from 'src/store';
import {
    $backgroundMeetingStore,
    $meetingTemplateStore,
    addBackgroundToCategoryEvent,
    reloadMediasEvent,
    uploadNewBackgroundFx,    
} from 'src/store/roomStores';
import { Notification, NotificationType } from 'src/store/types';
import { UploadImageIcon } from 'shared-frontend/icons/OtherIcons/UploadImageIcon';
import clsx from 'clsx';
import { SubscriptionsPlans } from '@components/Payments/SubscriptionsPlans/SubscriptionsPlans';
import { useToggle } from '@hooks/useToggle';
import {PlanKeys} from "shared-types";
import { useSubscriptionNotification } from '@hooks/useSubscriptionNotification';
import { profileRoute } from 'src/const/client-routes';
import { useRouter } from 'next/router';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import styles from './MeetingChangeBackground.module.scss';

const Component = () => {
    const router = useRouter();
    const meetingTemplate = useStore($meetingTemplateStore);
    const backgroundStore = useStore($backgroundMeetingStore);
    const isSubscriptionPurchasePending = useStore(startCheckoutSessionForSubscriptionFx.pending);
    const profile = useStore($profileStore)
    const isTrial = useStore($isTrial);
    useSubscriptionNotification(profileRoute);
    const {
        value: isSubscriptionsOpen,
        onSwitchOn: handleOpenSubscriptionPlans,
        onSwitchOff: handleCloseSubscriptionPlans,
    } = useToggle(false);

    const generateFileUploadError = (
        rejectedFiles: FileRejection[],
        total: number,
    ) => {
        if (!rejectedFiles.length) {
            return;
        }

        if (total > 1) {
            addNotificationEvent({
                type: NotificationType.UploadFileFail,
                message: 'createRoom.uploadBackground.manyFiles',
                withErrorIcon: true,
            });
            return;
        }

        const rejectedFile = rejectedFiles[0]?.file;
        if (!rejectedFile) return;

        const fileType = rejectedFile.type.split('/')[0];

        if (fileType !== 'image' && fileType !== 'video') return;

        const maxSize = fileType === 'image' ? MAX_SIZE_IMAGE : MAX_SIZE_VIDEO;
        const maxSizeMB =
            fileType === 'image' ? MAX_SIZE_IMAGE_MB : MAX_SIZE_VIDEO_MB;
        const isSizeExceeded = rejectedFile.size > maxSize;
        const isAcceptedMIME =
            fileType === 'image'
                ? ACCEPT_MIMES_IMAGE[rejectedFile.type]
                : ACCEPT_MIMES_VIDEO[rejectedFile.type];

        const notification: Notification = {
            type: NotificationType.UploadFileFail,
            messageOptions: { max: maxSizeMB },
            withErrorIcon: true,
            message: '',
        };

        if (isAcceptedMIME) {
            notification.message = `createRoom.uploadBackground.${fileType}.maxSize`;
        } else if (!isAcceptedMIME && isSizeExceeded) {
            notification.message = `createRoom.uploadBackground.${fileType}.general`;
        } else {
            notification.message = `createRoom.uploadBackground.${fileType}.invalidFormat`;
        }

        addNotificationEvent(notification);
    };

    const handleSetFileData = async (
        acceptedFiles: File[],
        rejectedFiles: FileRejection[],
    ) => {
        const totalFiles = acceptedFiles.length + rejectedFiles.length;

        if (rejectedFiles.length || totalFiles > 1) {
            generateFileUploadError(
                rejectedFiles,
                acceptedFiles.length + rejectedFiles.length,
            );
            return;
        }

        const file = acceptedFiles[0];

        if (ACCEPT_MIMES_IMAGE[file.type] && file.size > MAX_SIZE_IMAGE) {
            generateFileUploadError(
                [{ file, errors: [] }],
                acceptedFiles.length + rejectedFiles.length,
            );
            return;
        }

        const media = await uploadNewBackgroundFx({
            file,
            userTemplateId: meetingTemplate.id,
            mediaCategoryId: backgroundStore.categorySelected,
        });

        if (media) {
            if (backgroundStore.count <= 12) {
                addBackgroundToCategoryEvent({ media });
            } else {
                reloadMediasEvent();
            }
            addNotificationEvent({
                type: NotificationType.UploadBackgroundSuccess,
                message: 'meeting.uploadSuccess',
                withSuccessIcon: true,
            });
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        maxSize: Math.max(MAX_SIZE_IMAGE, MAX_SIZE_VIDEO),
        accept: ACCEPT_MIMES,
        onDrop: handleSetFileData,
        noDrag: false,
    });

    const { onClick, ...rootProps } = getRootProps();

    const handleOpenSelect = (e: MouseEvent<HTMLDivElement>) => {
        if(profile.subscriptionPlanKey === PlanKeys.Professional || profile.subscriptionPlanKey === PlanKeys.Business){
            onClick?.(e)
        }else{
            handleOpenSubscriptionPlans()
        }
    }

    const handleChooseSubscription = async (productId: string, isPaid: boolean, trial: boolean) => {
        if (isPaid && (!profile.stripeSubscriptionId || isTrial)) {
            const response = await startCheckoutSessionForSubscriptionFx({
                productId,
                baseUrl: profileRoute,
                withTrial: trial,
            });

            if (response?.url) {
                return router.push(response.url);
            }
        } else if (profile.stripeSubscriptionId) {
            const response = await getCustomerPortalSessionUrlFx({
                subscriptionId: profile.stripeSubscriptionId,
            });

            if (response?.url) {
                return router.push(response.url);
            }
        }
    };

    return (
        <>
            <CustomGrid
                {...rootProps}
                onClick={e => handleOpenSelect(e)}
                className={clsx(styles.container, styles.upload)}
            >
                <input {...getInputProps()} />
                <CustomBox
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                >
                    <UploadImageIcon width="32px" height="32px" />
                </CustomBox>
            </CustomGrid>
            <CustomDialog open={isSubscriptionsOpen} hideBackdrop>
                <SubscriptionsPlans
                    withBackgroundBlur
                    isSubscriptionStep
                    isDisabled={isSubscriptionPurchasePending}
                    withActivePlan={false}
                    activePlanKey={profile.subscriptionPlanKey}
                    onChooseSubscription={handleChooseSubscription}
                    buttonTranslation="buttons.upgradeTo"
                    onClose={handleCloseSubscriptionPlans}
                />
            </CustomDialog>
        </>
    );
};
export const UploadBackground = memo(Component);
