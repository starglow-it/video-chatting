import { memo, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useStore, useStoreMap } from 'effector-react';

// hooks
import { useTemplateNotification } from '@hooks/useTemplateNotification';

// components
import { MainProfileWrapper } from '@components/MainProfileWrapper/MainProfileWrapper';

// dialogs
import { TemplatePreviewDialog } from '@components/Dialogs/TemplatePreviewDialog/TemplatePreviewDialog';
import { DeleteTemplateDialog } from '@components/Dialogs/DeleteTemplateDialog/DeleteTemplateDialog';
import { ScheduleMeetingDialog } from '@components/Dialogs/ScheduleMeetingDialog/ScheduleMeetingDialog';
import { DownloadIcsEventDialog } from '@components/Dialogs/DownloadIcsEventDialog/DownloadIcsEventDialog';

import {
    EntityList,
    ICommonTemplate,
    IUserTemplate,
    RoomType,
} from 'shared-types';
import { FeaturedBackground } from '@components/FeaturedBackground/FeaturedBackground';
import { MainTemplates } from '@components/Templates/MainTemplates/MainTemplates';
import {
    $profileStore,
    $profileTemplatesCountStore,
    $profileTemplatesStore,
    $templatesStore,
    addTemplateToUserFx,
    clearTemplateDraft,
    createMeetingFx,
    deleteProfileTemplateFx,
    getBusinessCategoriesFx,
    getFeaturedBackgroundFx,
    getProfileTemplatesCountFx,
    purchaseTemplateFx,
    setQueryProfileTemplatesEvent,
} from '../../store';

// const
import { dashboardRoute } from '../../const/client-routes';

// utils
import { getClientMeetingUrl } from '../../utils/urls';

const Component = () => {
    const router = useRouter();
    const templates = useStore($templatesStore);
    const profile = useStore($profileStore);
    const { state: profileTemplatesCount } = useStore(
        $profileTemplatesCountStore,
    );
    const freeTemplates = useStoreMap<
        EntityList<IUserTemplate>,
        IUserTemplate[],
        [string]
    >({
        store: $profileTemplatesStore,
        keys: [profile.id],
        fn: (state, [profileId]) =>
            state?.list.filter(
                template =>
                    template.type === 'free' && template.author !== profileId,
            ),
    });
    const isFirstTime = useRef(true);

    const isTemplateDeleting = useStore(deleteProfileTemplateFx.pending);

    useTemplateNotification(dashboardRoute);

    useEffect(() => {
        (() => {
            getBusinessCategoriesFx({});
        })();
    }, []);

    useEffect(() => {
        getFeaturedBackgroundFx({
            skip: 0,
            limit: 9,
            roomType: RoomType.Featured,
            draft: false,
        });
    }, []);

    useEffect(() => {
        (async () => {
            if (!isTemplateDeleting && !isFirstTime.current) {
                setQueryProfileTemplatesEvent({ skip: 0 });
                await getProfileTemplatesCountFx({
                    limit: 0,
                    skip: 0,
                    templateType: 'free',
                });
            }
        })();
    }, [isTemplateDeleting]);

    useEffect(() => {
        getProfileTemplatesCountFx({
            limit: 0,
            skip: 0,
            templateType: 'free',
        });
        isFirstTime.current = false;
        return () => clearTemplateDraft();
    }, []);

    const handleCreateMeeting = useCallback(
        async ({ templateId }: { templateId: ICommonTemplate['id'] }) => {
            const result = await createMeetingFx({ templateId });

            if (result.template) {
                await router.push(
                    getClientMeetingUrl(
                        result.template?.customLink || result?.template?.id,
                    ),
                );
            }
        },
        [],
    );

    const handleReplaceTemplate = async ({
        templateId,
        deleteTemplateId,
    }: {
        deleteTemplateId: IUserTemplate['id'];
        templateId: ICommonTemplate['id'];
    }) => {
        const targetTemplate = templates?.list?.find(
            template => template.id === templateId,
        );

        if (targetTemplate?.type === 'paid') {
            const response = await purchaseTemplateFx({ templateId });

            router.push(response.url);

            return;
        }

        deleteProfileTemplateFx({ templateId: deleteTemplateId });

        await handleCreateMeeting({ templateId });
    };

    const handleChooseCommonTemplate = useCallback(
        async (templateId: ICommonTemplate['id']) => {
            const targetTemplate = templates?.list?.find(
                template => template.id === templateId,
            );

            if (targetTemplate?.type === 'paid') {
                const response = await purchaseTemplateFx({ templateId });

                router.push(response.url);

                return;
            }

            if (profile.maxTemplatesNumber === profileTemplatesCount.count) {
                const roomPlace = freeTemplates?.at(-1);
                if (roomPlace) {
                    await handleReplaceTemplate({
                        templateId,
                        deleteTemplateId: roomPlace.id,
                    });
                }
                return;
            }

            const newTemplate = await addTemplateToUserFx({ templateId });

            if (newTemplate) {
                await handleCreateMeeting({ templateId: newTemplate.id });
            }
        },
        [
            templates,
            profile.maxTemplatesNumber,
            profileTemplatesCount.count,
            handleCreateMeeting,
            freeTemplates,
        ],
    );

    return (
        <MainProfileWrapper>
            <FeaturedBackground onChooseTemplate={handleChooseCommonTemplate} />
            <MainTemplates />
            <TemplatePreviewDialog
                isNeedToRenderTemplateInfo
                chooseButtonKey="chooseTemplate"
                onChooseTemplate={handleChooseCommonTemplate}
            />
            <DeleteTemplateDialog />
            <ScheduleMeetingDialog />
            <DownloadIcsEventDialog />
        </MainProfileWrapper>
    );
};

export const TemplatesContainer = memo(Component);
