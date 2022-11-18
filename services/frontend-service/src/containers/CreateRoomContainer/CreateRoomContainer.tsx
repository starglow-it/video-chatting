import React, { memo, useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// custom
import { CustomGrid } from 'shared-frontend/library';
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';

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
import {
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
import { adjustUserPositions } from '../../utils/positions/adjustUserPositions';

// styles
import styles from './CreateRoomContainer.module.scss';

const Component = () => {
    const isGetTemplateRequestIsPending = useStore(getEditingTemplateFx.pending);
    const isTemplatePreviewPending = useStore(uploadTemplateFileFx.pending);
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
                    onSetUpdateUrl(`${getCreateRoomUrl(template?.id)}?step=privacy`);

                    setTemplate(response);
                }
            }
        })();
    }, [router.isReady]);

    useEffect(() => {
        getSubscriptionWithDataFx();
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
                businessCategories: data.tags,
                draft: false,
                url: data.url,
                previewUrls: data.previewUrls,
            };

            await editTemplateFx({
                templateId: template.id,
                data: payload,
            });

            const userTemplate = await addTemplateToUserFx({
                templateId: template.id,
            });

            const { businessCategories, ...newPayload } = payload;

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
                businessCategories: data.tags,
                draft: false,
                url: data.url,
                previewUrls: data.previewUrls,
            };

            await editTemplateFx({
                templateId: template.id,
                data: payload,
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
                <WiggleLoader className={styles.loader} />
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
                isSubscriptionStep={isSubscriptionStep}
                onChooseSubscription={handleChooseSubscription}
                onClose={onHideSubscriptions}
                onlyPaidPlans
            />
        </>
    );
};

export const CreateRoomContainer = memo(Component);
