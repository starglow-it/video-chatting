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
} from '../../store';

// utils
import { getCreateRoomUrl } from '../../utils/urls';

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

    const router = useRouter();

    const [template, setTemplate] = useState<ICommonTemplate | null>(null);

    const {
        value: isSubscriptionStep,
        onSwitchOn: onShowSubscriptions,
        onSwitchOff: onHideSubscriptions,
    } = useToggle(false);

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

    const handleSubmit = useCallback(
        async (data: IUploadTemplateFormData) => {
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
                businessCategories:
                    template.categoryType === 'interior-design'
                        ? []
                        : data.tags,
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
            }

            await router.push(dashboardRoute);
        },
        [template?.id],
    );

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

    const handleUpgradePlan = useCallback(
        async (data: IUploadTemplateFormData) => {
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
                businessCategories:
                    template.categoryType === 'interior-design'
                        ? []
                        : data.tags,
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
            };

            await editTemplateFx({
                templateId: template.id,
                data: payload as any,
            });

            onShowSubscriptions();
        },
        [onShowSubscriptions, template?.templateId],
    );

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
