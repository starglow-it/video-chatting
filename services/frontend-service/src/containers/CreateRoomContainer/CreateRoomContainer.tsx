import React, { memo, useCallback, useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';

// components
import { TemplateManagement } from '@components/TemplateManagement/TemplateManagement';
import { SubscriptionsPlans } from '@components/Payments/SubscriptionsPlans/SubscriptionsPlans';

// const
import { dashboardRoute } from 'src/const/client-routes';

// types
import { EditTemplatePayload } from '../../store/templates/types';
import { Template } from '../../store/types';

// hooks
import { useToggle } from '@hooks/useToggle';
import { useSubscriptionNotification } from '@hooks/useSubscriptionNotification';

// store
import {
    $profileStore,
    addTemplateToUserFx,
    clearTemplateDraft,
    editTemplateFx,
    editUserTemplateFx,
    getEditingTemplateFx,
    getSubscriptionWithDataFx, getTemplateFx,
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
    const isGetTemplateRequestIsPending = useStore(getEditingTemplateFx.pending);
    const isTemplatePreviewPending = useStore(uploadTemplateFileFx.pending);
    const profile = useStore($profileStore);

    const router = useRouter();

    const [template, setTemplate] = useState<Template | null>(null);

    const {
        value: isSubscriptionStep,
        onSwitchOn: onShowSubscriptions,
        onSwitchOff: onHideSubscriptions,
    } = useToggle(false);

    useSubscriptionNotification(`${getCreateRoomUrl(template?.id ?? '')}?step=privacy`);

    useEffect(() => {
        (async () => {
            if (!router.isReady) {
                return;
            }
            const { templateId } = router.query;

            if (templateId && typeof templateId === 'string') {
                const response = await getTemplateFx({ templateId });
                if (response) {
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
        // TODO: delete common template if canceled and other data associated with it
        router.push(dashboardRoute);
    }, []);

    const handleSubmit = useCallback(async (data: EditTemplatePayload['data']) => {
        if (!template?.templateId) {
            return;
        }

        await editTemplateFx({
            templateId: template.id,
            data,
        });

        const userTemplate = await addTemplateToUserFx({
            templateId: template.id,
        });

        const { businessCategories, ...newPayload } = data;

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

    const handleUploadFile = useCallback((file: File) => {
        if (!template?.id) {
            return;
        }

        return uploadTemplateFileFx({
            file,
            templateId: template.id,
        });
    }, [template?.id]);

    const handleUpgradePlan = useCallback(async (data: EditTemplatePayload['data']) => {
        if (!template?.templateId) {
            return;
        }

        await editTemplateFx({
            templateId: template.id,
            data,
        });

        onShowSubscriptions();
    }, [onShowSubscriptions, template?.templateId]);

    const handleChooseSubscription = useCallback(async (productId: string, isPaid: boolean) => {
        if (!template?.id) {
            return;
        }

        if (isPaid) {
            const response = await startCheckoutSessionForSubscriptionFx({
                productId,
                subscriptionId: profile.stripeSubscriptionId,
                baseUrl: `${getCreateRoomUrl(template.id)}?step=privacy`,
            });

            if (response?.url) {
                return router.push(response.url);
            }
        }
    }, [profile.stripeSubscriptionId, template?.id]);

    if (isGetTemplateRequestIsPending) {
        return (
            <CustomGrid container className={styles.wrapper}>
                <WiggleLoader className={styles.loader} />
            </CustomGrid>
        );
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
                onlyPaidPlans={true}
            />
        </>
    );
};

export const CreateRoomContainer = memo(Component);

