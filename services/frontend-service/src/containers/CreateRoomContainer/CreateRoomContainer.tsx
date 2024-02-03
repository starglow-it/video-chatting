import { memo, useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';

// components
import { TemplateManagement } from '@components/TemplateManagement/TemplateManagement';
import { SubscriptionsPlans } from '@components/Payments/SubscriptionsPlans/SubscriptionsPlans';

// const
import { dashboardRoute } from 'src/const/client-routes';

// types
import { IUploadTemplateFormData } from '@containers/CreateRoomContainer/types';
import { ICommonTemplate } from 'shared-types';

// hooks
import { useToggle } from '@hooks/useToggle';
import { useSubscriptionNotification } from '@hooks/useSubscriptionNotification';

// store
import { adjustUserPositions } from 'shared-utils';
import { mapToThumbYoutubeUrl } from 'src/utils/functions/mapToThumbYoutubeUrl';
import {
    $isUploadTemplateBackgroundInProgress,
    $profileStore,
    createMeetingFx,
    updateProfileFx,
    addTemplateToUserFx,
    clearTemplateDraft,
    deleteCommonTemplateFx,
    editTemplateFx,
    editUserTemplateFx,
    getEditingTemplateFx,
    getSubscriptionWithDataFx,
    getTemplateFx,
    initWindowListeners,
    removeWindowListeners,
    startCheckoutSessionForSubscriptionFx,
    uploadTemplateFileFx,
    setScheduleTemplateIdEvent,
    appDialogsApi
} from '../../store';

import {
    $isToggleCreateRoomPayment,
    $createRoomPaymentStore,
    updatePaymentMeetingFx
} from '../../store/roomStores';

import { AppDialogsEnum } from '../../store/types';

// utils
import { getCreateRoomUrl, getClientMeetingUrl } from '../../utils/urls';

// styles
import styles from './CreateRoomContainer.module.scss';

const Component = () => {
    const isGetTemplateRequestIsPending = useStore(
        getEditingTemplateFx.pending,
    );
    const isTemplatePreviewPending = useStore(
        $isUploadTemplateBackgroundInProgress,
    );
    const profile = useStore($profileStore);
    const isToggleCreateRoomPayment = useStore($isToggleCreateRoomPayment);
    const createRoomPaymentStore = useStore($createRoomPaymentStore);

    const router = useRouter();

    const [template, setTemplate] = useState<ICommonTemplate | null>(null);

    const {
        value: isSubscriptionStep,
        onSwitchOn: onShowSubscriptions,
        onSwitchOff: onHideSubscriptions,
    } = useToggle(false);

    useEffect(() => { console.log(isSubscriptionStep); }, [isSubscriptionStep]);

    const { onSetUpdateUrl } = useSubscriptionNotification();

    useEffect(() => {
        (async () => {
            if (!router.isReady) {
                return;
            }
            const { templateId } = router.query;

            if (templateId && typeof templateId === 'string') {
                const response = await getTemplateFx({ templateId });

                if (response) {
                    onSetUpdateUrl(
                        `${getCreateRoomUrl(response?.id || '')}?step=privacy`,
                    );
                    setTemplate(response);
                }
            }
        })();
    }, [router.isReady]);

    useEffect(() => {
        getSubscriptionWithDataFx({ subscriptionId: '' });
        initWindowListeners();

        return () => {
            removeWindowListeners();
        };
    }, []);

    useEffect(() => () => clearTemplateDraft(), []);

    const handleCancel = useCallback(async () => {
        if (template?.id) {
            await deleteCommonTemplateFx({ templateId: template.id });
        }

        router.push(dashboardRoute);
    }, [template?.id]);

    const handleCreateRoom = useCallback(async (data: IUploadTemplateFormData) => {
        if (!template?.templateId) {
            return;
        }

        const payload = {
            name: data.name,
            description: data.description,
            customLink: data.customLink,
            isPublic: data.isPublic,
            maxParticipants: data.participantsNumber,
            usersPosition: adjustUserPositions(data.participantsPositions),
            businessCategories: data.tags,
            draft: false,
            url: data.url,
            previewUrls: data.previewUrls,
            links: data.templateLinks?.map(link => ({
                item: link.value,
                title: link.title ?? '',
                position: {
                    top: link.top,
                    left: link.left,
                },
            })),
            mediaLink: data.youtubeUrl
                ? {
                    src: data.youtubeUrl,
                    thumb: mapToThumbYoutubeUrl(data.youtubeUrl),
                    platform: 'youtube',
                }
                : null,
        } as any;

        await editTemplateFx({
            templateId: template.id,
            data: payload,
        });

        await updateProfileFx({ description: data.aboutTheHost });

        const userTemplate = await addTemplateToUserFx({
            templateId: template.id,
        });

        const newPayload = { ...payload };
        delete newPayload?.businessCategories;

        if (userTemplate?.id) {
            await editUserTemplateFx({
                templateId: userTemplate.id,
                data: newPayload,
            });

            if (isToggleCreateRoomPayment) {
                await updatePaymentMeetingFx({
                    data: createRoomPaymentStore,
                    templateId: userTemplate.id
                });
            }
        }

        return userTemplate;
    }, [template?.id, createRoomPaymentStore]);

    const handleSubmit = async (data: IUploadTemplateFormData) => {
        const userTemplate = await handleCreateRoom(data);
        if (!!userTemplate) {
            await router.push(dashboardRoute);
        }
    };

    const handleSubmitAndEnterMeeting = async (data: IUploadTemplateFormData) => {
        const userTemplate = await handleCreateRoom(data);

        if (!!userTemplate) {
            const result = await createMeetingFx({ templateId: userTemplate?.id });

            if (result.template) {
                const newPageUrl = await getClientMeetingUrl(
                    result.template?.customLink || result?.template?.id,
                );

                window.open(newPageUrl, '_blank');
            }
        }
    }

    const handleSubmitAndScheduleMeeting = async (data: IUploadTemplateFormData) => {
        const userTemplate = await handleCreateRoom(data);

        if (!!userTemplate) {
            setScheduleTemplateIdEvent(userTemplate?.id);
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.scheduleMeetingDialog,
            });
        }
    }

    const handleUploadFile = useCallback(
        (file: File) => {
            if (!template?.id) {
                return;
            }

            return uploadTemplateFileFx({
                file,
                templateId: template.id,
            });
        },
        [template?.id],
    );
    
    const handleUpgradePlan = () => {
        onShowSubscriptions();
    };

    const handleChooseSubscription = useCallback(
        async (productId: string, isPaid: boolean) => {
            if (!template?.id) {
                return;
            }

            if (!isPaid) {
                return;
            }

            const response = await startCheckoutSessionForSubscriptionFx({
                productId,
                baseUrl: `${getCreateRoomUrl(template.id)}?step=privacy`,
            });

            if (response?.url) {
                return router.push(response.url);
            }
        },
        [profile.stripeSubscriptionId, template?.id],
    );

    if (isGetTemplateRequestIsPending) {
        return (
            <CustomGrid container className={styles.wrapper}>
                <CustomLoader className={styles.loader} />
            </CustomGrid>
        );
    }

    if (!template) {
        return null;
    }

    return (
        <>
            <TemplateManagement
                template={template}
                onSubmit={handleSubmit}
                onSubmitAndEnterMeeting={handleSubmitAndEnterMeeting}
                onSubmitAndScheduleMeeting={handleSubmitAndScheduleMeeting}
                onCancel={handleCancel}
                onUploadFile={handleUploadFile}
                onUpgradePlan={handleUpgradePlan}
                isFileUploading={isTemplatePreviewPending}
            />
            <SubscriptionsPlans
                isDisabled={false}
                activePlanKey={profile.subscriptionPlanKey}
                isSubscriptionStep={isSubscriptionStep}
                onChooseSubscription={handleChooseSubscription}
                onClose={onHideSubscriptions}
            />
        </>
    );
};

export const CreateRoomContainer = memo(Component);
