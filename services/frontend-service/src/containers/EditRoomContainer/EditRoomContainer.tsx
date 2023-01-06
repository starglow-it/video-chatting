import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';

// hooks
import { useToggle } from '@hooks/useToggle';
import { useSubscriptionNotification } from '@hooks/useSubscriptionNotification';

// components
import { TemplateManagement } from '@components/TemplateManagement/TemplateManagement';
import { SubscriptionsPlans } from '@components/Payments/SubscriptionsPlans/SubscriptionsPlans';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';

// const
import { IUploadTemplateFormData } from '@containers/CreateRoomContainer/types';
import { dashboardRoute } from '../../const/client-routes';

// types

// store
import {
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
import { convertToBase64 } from '../../utils/string/convertToBase64';

// styles
import styles from './EditRoomContainer.module.scss';
import {IUserTemplate} from "shared-types";
import {adjustUserPositions} from "shared-utils";

const Component = () => {
    const prevTemplateDataRef = useRef<IUserTemplate | null>(null);
    const isGetTemplateRequestIsPending = useStore(getEditingTemplateFx.pending);
    const isUpdateMeetingTemplateFilePending = useStore(uploadUserTemplateFileFx.pending);

    const [template, setTemplate] = useState<IUserTemplate | null>(null);

    const savedTemplateProgress = useRef<IUploadTemplateFormData | null>(null);

    const {
        value: isSubscriptionStep,
        onSwitchOn: onShowSubscriptions,
        onSwitchOff: onHideSubscriptions,
    } = useToggle(false);

    const router = useRouter();

    useSubscriptionNotification(
        `${getEditRoomUrl((template?.customLink || template?.id) ?? '')}?step=privacy`,
    );

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

    const handleSubmit = useCallback(
        async (data: IUploadTemplateFormData) => {
            if (!template?.id) {
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

            await editUserTemplateFx({
                templateId: template.id,
                data: payload,
            });

            await router.push(dashboardRoute);
        },
        [template?.id],
    );

    const handleCancelRoomCreation = useCallback(async () => {
        if (prevTemplateDataRef.current) {
            await editUserTemplateFx({
                templateId: prevTemplateDataRef.current.id,
                data: prevTemplateDataRef.current,
            });
        }
        router.push(dashboardRoute);
    }, []);

    const handleUploadFile = useCallback(
        (file: File) => {
            if (!template?.id) {
                return;
            }

            return uploadUserTemplateFileFx({
                file,
                uploadKey: "draftUrl",
                templateId: template.id,
            });
        },
        [template?.id],
    );

    const handleUpgradePlan = useCallback(
        async (data: IUploadTemplateFormData) => {
            savedTemplateProgress.current = data;
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

            let data = '';
            if (savedTemplateProgress.current) {
                const { background, ...dataToSave } = savedTemplateProgress.current;
                data = convertToBase64(dataToSave);
            }
            const dataParam = data ? `&data=${data}` : '';
            const response = await startCheckoutSessionForSubscriptionFx({
                productId,
                baseUrl: `${getEditRoomUrl(
                    template.customLink || template.id,
                )}?step=privacy${dataParam}`,
            });

            if (response?.url) {
                return router.push(response.url);
            }
        },
        [template?.id, template?.customLink],
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
                onlyPaidPlans
            />
        </>
    );
};

export const EditRoomContainer = memo(Component);
