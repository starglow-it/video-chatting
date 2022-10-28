import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';

// components
import { TemplateManagement } from '@components/TemplateManagement/TemplateManagement';
import { SubscriptionsPlans } from '@components/Payments/SubscriptionsPlans/SubscriptionsPlans';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';

// const
import { dashboardRoute } from '../../const/client-routes';

// types
import { UserTemplate } from '../../store/types';
import { EditUserTemplatePayload } from '../../store/templates/types';

// hooks
import { useToggle } from '@hooks/useToggle';
import { useSubscriptionNotification } from '@hooks/useSubscriptionNotification';

// store
import {
    $profileStore,
    clearTemplateDraft,
    editUserTemplateFx,
    getEditingTemplateFx,
    getSubscriptionWithDataFx,
    initWindowListeners,
    removeWindowListeners,
    startCheckoutSessionForSubscriptionFx,
    uploadUserTemplateFileFx,
} from '../../store';

// utils
import { getEditRoomUrl } from '../../utils/urls';

// styles
import styles from './EditRoomContainer.module.scss';

const Component = () => {
    const prevTemplateDataRef = useRef<UserTemplate | null>(null);
    const isGetTemplateRequestIsPending = useStore(getEditingTemplateFx.pending);
    const isUpdateMeetingTemplateFilePending = useStore(uploadUserTemplateFileFx.pending);
    const profile = useStore($profileStore);

    const [template, setTemplate] = useState<UserTemplate | null>(null);

    const {
        value: isSubscriptionStep,
        onSwitchOn: onShowSubscriptions,
        onSwitchOff: onHideSubscriptions,
    } = useToggle(false);

    const router = useRouter();

    useSubscriptionNotification(`${getEditRoomUrl(template?.id ?? '')}?step=privacy`);

    useEffect(() => {
        (async () => {
            if (!router.isReady) {
                return;
            }
            const { templateId } = router.query;
            if (templateId && typeof templateId === 'string') {
                const response = await getEditingTemplateFx({ templateId, withCredentials: true });

                if (response) {
                    prevTemplateDataRef.current = response;
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

    const handleSubmit = useCallback(async (data: EditUserTemplatePayload['data']) => {
        if (!template?.id) {
            return;
        }
        await editUserTemplateFx({
            templateId: template.id,
            data,
        });
        await router.push(dashboardRoute);
    }, [template?.id]);

    const handleCancelRoomCreation = useCallback(async () => {
        if (prevTemplateDataRef.current) {
            await editUserTemplateFx({
                templateId: prevTemplateDataRef.current.id,
                data: prevTemplateDataRef.current,
            });
        }
        // TODO: delete common template if canceled and other data associated with it
        router.push(dashboardRoute);
    }, []);

    const handleUploadFile = useCallback((file: File) => {
        if (!template?.id) {
            return;
        }

        return uploadUserTemplateFileFx({
            file,
            templateId: template.id,
        });
    }, [template?.id]);

    const handleUpgradePlan = useCallback(async (data: EditUserTemplatePayload['data']) => {
        if (!template?.templateId) {
            return;
        }

        await editUserTemplateFx({
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
                baseUrl: `${getEditRoomUrl(template.id)}?step=privacy`,
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
                onCancel={handleCancelRoomCreation}
                onUploadFile={handleUploadFile}
                onUpgradePlan={handleUpgradePlan}
                isFileUploading={isUpdateMeetingTemplateFilePending}
            />
            <SubscriptionsPlans
                isDisabled={false}
                isSubscriptionStep={isSubscriptionStep}
                onChooseSubscription={handleChooseSubscription}
                onClose={onHideSubscriptions}
                onlyPaidPlans={true}
            />
        </>
    )
};

export const EditRoomContainer = memo(Component);
