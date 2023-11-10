import { memo, useCallback } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import {
    $isBusinessSubscription,
    $isProfessionalSubscription,
    $isTrial,
    $modeTemplateStore,
    $profileStore,
    $profileTemplatesCountStore,
    $profileTemplatesStore,
    $queryProfileTemplatesStore,
    $templateDraft,
    $templatesStore,
    addTemplateToUserFx,
    createMeetingFx,
    createTemplateFx,
    deleteProfileTemplateFx,
    getCustomerPortalSessionUrlFx,
    getProfileTemplatesFx,
    getTemplatesFx,
    purchaseTemplateFx,
    setSkipProfileTemplates,
    startCheckoutSessionForSubscriptionFx,
} from 'src/store';
import { useStore, useStoreMap } from 'effector-react';
import { EntityList, ICommonTemplate, IUserTemplate } from 'shared-types';
import { useRouter } from 'next/router';
import { getClientMeetingUrl, getCreateRoomUrl } from 'src/utils/urls';
import { SubscriptionsPlans } from '@components/Payments/SubscriptionsPlans/SubscriptionsPlans';
import { useToggle } from '@hooks/useToggle';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { dashboardRoute } from 'src/const/client-routes';
import { PlusIcon } from 'shared-frontend/icons/OtherIcons/PlusIcon';
import { ProfileTemplateItem } from '../ProfileTemplateItem/ProfileTemplateItem';
import { CommonTemplateItem } from '../CommonTemplateItem/CommonTemplateItem';
import { TemplatesGrid } from '../TemplatesGrid/TemplatesGrid';
import { MenusTemplate } from '../Menus/Menus';
import styles from './MainTemplates.module.scss';

const Component = () => {
    const router = useRouter();
    const templates = useStore($templatesStore);
    const profile = useStore($profileStore);
    const { state: profileTemplatesCount } = useStore(
        $profileTemplatesCountStore,
    );
    const profileTemplates = useStore($profileTemplatesStore);
    const mode = useStore($modeTemplateStore);
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
    const isBusinessSubscription = useStore($isBusinessSubscription);
    const isProfessionalSubscription = useStore($isProfessionalSubscription);
    const isSubscriptionPurchasePending = useStore(
        startCheckoutSessionForSubscriptionFx.pending,
    );
    const templateDraft = useStore($templateDraft);
    const isTrial = useStore($isTrial);
    const queryProfileTemplates = useStore($queryProfileTemplatesStore);

    const isCustom = queryProfileTemplates.categoryType === 'interior-design';

    const {
        value: isSubscriptionsOpen,
        onSwitchOn: handleOpenSubscriptionPlans,
        onSwitchOff: handleCloseSubscriptionPlans,
    } = useToggle(false);

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

    const handleCommonTemplatesPageChange = useCallback(
        async (newPage: number) => {
            await getTemplatesFx({
                draft: false,
                isPublic: true,
                limit: 6 * newPage,
                skip: 0,
                userId: profile.id,
                sort: 'maxParticipants',
                direction: 1,
            });
        },
        [profile.id],
    );

    const handleProfileTemplatesPageChange = useCallback(
        async (newPage: number) => {
            await getProfileTemplatesFx({ limit: 6 * newPage, skip: 0 });
            setSkipProfileTemplates(6 * newPage);
        },
        [],
    );

    const handleChooseProfileTemplate = useCallback(
        async (templateId: IUserTemplate['id']) => {
            await handleCreateMeeting({ templateId });
        },
        [handleCreateMeeting],
    );

    const handleCreateRoom = useCallback(async () => {
        let response;
        if (!templateDraft?.id) {
            response = await createTemplateFx();
        }

        if (isBusinessSubscription || isProfessionalSubscription) {
            router.push(
                getCreateRoomUrl(templateDraft?.id ?? response?.id ?? ''),
            );
            return;
        }

        handleOpenSubscriptionPlans();
    }, [
        isBusinessSubscription,
        isProfessionalSubscription,
        handleOpenSubscriptionPlans,
        templateDraft?.id,
    ]);

    const handleCreateRoomDesign = async () => {
        const response = await createTemplateFx('interior-design');
        router.push(`${getCreateRoomUrl(response?.id ?? '')}`);
    };

    const renderTemplates = () => {
        switch (mode) {
            case 'private':
                return (
                    <TemplatesGrid<IUserTemplate>
                        list={profileTemplates.list}
                        count={profileTemplates.count}
                        onPageChange={handleProfileTemplatesPageChange}
                        onChooseTemplate={handleChooseProfileTemplate}
                        TemplateComponent={ProfileTemplateItem}
                        allowCreate
                        ElementCreate={
                            isCustom ? (
                                <CustomGrid
                                    display="flex"
                                    flexDirection="row"
                                    alignItems="center"
                                >
                                    <PlusIcon width="22px" height="22px" />
                                    <CustomTypography
                                        nameSpace="templates"
                                        translation="addYourDesign"
                                    />
                                </CustomGrid>
                            ) : undefined
                        }
                        onCreate={
                            isCustom ? handleCreateRoomDesign : handleCreateRoom
                        }
                        isCustomElementCreate={isCustom}
                    />
                );

            case 'common':
                return (
                    <TemplatesGrid<ICommonTemplate>
                        list={templates.list}
                        count={templates.count}
                        onPageChange={handleCommonTemplatesPageChange}
                        onChooseTemplate={handleChooseCommonTemplate}
                        TemplateComponent={CommonTemplateItem}
                    />
                );
            default:
                return null;
        }
    };

    const handleChooseSubscription = useCallback(
        async (productId: string, isPaid: boolean, trial: boolean) => {
            if (isPaid && (!profile.stripeSubscriptionId || isTrial)) {
                const response = await startCheckoutSessionForSubscriptionFx({
                    productId,
                    baseUrl: getCreateRoomUrl(templateDraft?.id ?? ''),
                    cancelUrl: dashboardRoute,
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
        },
        [profile.stripeSubscriptionId, templateDraft?.id, isTrial],
    );

    return (
        <>
            <CustomGrid
                className={styles.commonTemplates}
                container
                direction="column"
                justifyContent="flex-start"
            >
                <MenusTemplate />
                {renderTemplates()}
            </CustomGrid>
            <SubscriptionsPlans
                withBackgroundBlur
                isSubscriptionStep={isSubscriptionsOpen}
                isDisabled={isSubscriptionPurchasePending}
                withActivePlan={false}
                activePlanKey={profile.subscriptionPlanKey}
                onChooseSubscription={handleChooseSubscription}
                buttonTranslation="buttons.upgradeTo"
                title={
                    <CustomGrid
                        container
                        direction="column"
                        alignItems="center"
                        className={styles.subscriptionPlansTitle}
                    >
                        <CustomTypography
                            variant="h2"
                            nameSpace="subscriptions"
                            translation="upgradePlan.title"
                            color="colors.orange.primary"
                        />
                        <CustomTypography
                            nameSpace="subscriptions"
                            translation="upgradePlan.description"
                            color="colors.orange.primary"
                        />
                    </CustomGrid>
                }
                onClose={handleCloseSubscriptionPlans}
            />
        </>
    );
};
export const MainTemplates = memo(Component);
