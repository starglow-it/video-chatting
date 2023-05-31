import React, { memo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { useStore, useStoreMap } from 'effector-react';

// hooks
import { useTemplateNotification } from '@hooks/useTemplateNotification';
import { useToggle } from '@hooks/useToggle';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomChip } from 'shared-frontend/library/custom/CustomChip';

// components
import { MainProfileWrapper } from '@components/MainProfileWrapper/MainProfileWrapper';
import { CommonTemplateItem } from '@components/Templates/CommonTemplateItem/CommonTemplateItem';
import { TemplatesGrid } from '@components/Templates/TemplatesGrid/TemplatesGrid';
import { ProfileTemplateItem } from '@components/Templates/ProfileTemplateItem/ProfileTemplateItem';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { SubscriptionsPlans } from '@components/Payments/SubscriptionsPlans/SubscriptionsPlans';

// dialogs
import { TemplatePreviewDialog } from '@components/Dialogs/TemplatePreviewDialog/TemplatePreviewDialog';
import { DeleteTemplateDialog } from '@components/Dialogs/DeleteTemplateDialog/DeleteTemplateDialog';
import { ScheduleMeetingDialog } from '@components/Dialogs/ScheduleMeetingDialog/ScheduleMeetingDialog';
import { DownloadIcsEventDialog } from '@components/Dialogs/DownloadIcsEventDialog/DownloadIcsEventDialog';
import { ReplaceTemplateDialog } from '@components/Dialogs/ReplaceTemplateDialog/ReplaceTemplateDialog';
import { TimeExpiredDialog } from '@components/Dialogs/TimeExpiredDialog/TimeExpiredDialog';

// icons
import { PlusIcon } from 'shared-frontend/icons/OtherIcons/PlusIcon';

// shared
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

// stores
import { useLocalization } from '@hooks/useTranslation';
import { EntityList, ICommonTemplate, IUserTemplate } from 'shared-types';
import { Translation } from '@library/common/Translation/Translation';
import {
    $isBusinessSubscription,
    $isProfessionalSubscription,
    $isTrial,
    $profileStore,
    $profileTemplatesCountStore,
    $profileTemplatesStore,
    $skipProfileTemplates,
    $templateDraft,
    $templatesStore,
    addTemplateToUserFx,
    clearTemplateDraft,
    createMeetingFx,
    createTemplateFx,
    deleteProfileTemplateFx,
    getBusinessCategoriesFx,
    getCustomerPortalSessionUrlFx,
    getProfileTemplatesCountFx,
    getProfileTemplatesFx,
    getTemplatesFx,
    purchaseTemplateFx,
    setSkipProfileTemplates,
    startCheckoutSessionForSubscriptionFx,
} from '../../store';

// styles
import styles from './TemplatesContainer.module.scss';

// const
import { dashboardRoute } from '../../const/client-routes';

// utils
import { getClientMeetingUrl, getCreateRoomUrl } from '../../utils/urls';
import { FeaturedBackground } from '@components/FeaturedBackground/FeaturedBackground';
import { MenusTemplate } from '@components/Templates/Menus/Menus';
import { MainTemplates } from '@components/Templates/MainTemplates/MainTemplates';

const Component = () => {
    const router = useRouter();

    const profileTemplates = useStore($profileTemplatesStore);

    const templates = useStore($templatesStore);
    const skipProfileTemplates = useStore($skipProfileTemplates);
    const profile = useStore($profileStore);
    const isBusinessSubscription = useStore($isBusinessSubscription);
    const isProfessionalSubscription = useStore($isProfessionalSubscription);
    const { state: profileTemplatesCount } = useStore(
        $profileTemplatesCountStore,
    );
    const templateDraft = useStore($templateDraft);
    const isTrial = useStore($isTrial);
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

    const isTemplateDeleting = useStore(deleteProfileTemplateFx.pending);
    const isSubscriptionPurchasePending = useStore(
        startCheckoutSessionForSubscriptionFx.pending,
    );

    const { translation } = useLocalization('subscriptions');

    const {
        value: isSubscriptionsOpen,
        onSwitchOn: handleOpenSubscriptionPlans,
        onSwitchOff: handleCloseSubscriptionPlans,
    } = useToggle(false);

    useTemplateNotification(dashboardRoute);

    useEffect(() => {
        (() => {
            getBusinessCategoriesFx({});
        })();
    }, []);

    useEffect(() => {
        getTemplatesFx({
            draft: false,
            isPublic: true,
            limit: 6,
            skip: 0,
            userId: profile.id,
            sort: ['maxParticipants', 'cc'],
            direction: 1,
        });
    }, []);

    useEffect(() => {
        (async () => {
            if (!isTemplateDeleting) {
                await getProfileTemplatesFx({
                    limit: skipProfileTemplates,
                    skip: 0,
                });
                await getProfileTemplatesCountFx({
                    limit: 0,
                    skip: 0,
                    templateType: 'free',
                });
            }
        })();
    }, [isTemplateDeleting]);

    useEffect(() => () => clearTemplateDraft(), []);

    const isThereProfileTemplates = Boolean(profileTemplates?.list?.length);

    const handleProfileTemplatesPageChange = useCallback(
        async (newPage: number) => {
            await getProfileTemplatesFx({ limit: 6 * newPage, skip: 0 });

            setSkipProfileTemplates(6 * newPage);
        },
        [],
    );

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

    const templatesLimit = `${profileTemplatesCount.count}/${profile.maxTemplatesNumber}`;

    return (
        <MainProfileWrapper>
            <FeaturedBackground />
            {/* <ConditionalRender condition={isThereProfileTemplates}>
                <CustomGrid
                    container
                    direction="column"
                    justifyContent="center"
                >
                    <CustomGrid
                        container
                        alignItems="center"
                        justifyContent="center"
                    >
                        <CustomBox className={styles.image}>
                            <CustomImage
                                src="/images/ok-hand.webp"
                                width="40px"
                                height="40px"
                                alt="ok-hand"
                            />
                        </CustomBox>
                        <CustomTypography
                            variant="h1"
                            nameSpace="templates"
                            translation="myTemplates"
                        />
                    </CustomGrid>
                    <CustomGrid container justifyContent="center">
                        <CustomTypography
                            color="colors.grayscale.semidark"
                            dangerouslySetInnerHTML={{
                                __html: translation('limits.templates', {
                                    templatesLimit,
                                }),
                            }}
                        />
                    </CustomGrid>
                    <CustomChip
                        active
                        label={
                            <CustomTypography>
                                <Translation
                                    nameSpace="templates"
                                    translation="createRoom"
                                />
                            </CustomTypography>
                        }
                        size="medium"
                        onClick={handleCreateRoom}
                        icon={<PlusIcon width="24px" height="24px" />}
                        className={styles.createRoomButton}
                    />
                    <TemplatesGrid<IUserTemplate>
                        list={profileTemplates.list}
                        count={profileTemplates.count}
                        onPageChange={handleProfileTemplatesPageChange}
                        onChooseTemplate={handleChooseProfileTemplate}
                        TemplateComponent={ProfileTemplateItem}
                    />
                </CustomGrid>
            </ConditionalRender> */}
            <MainTemplates />
           
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
                        />
                        <CustomTypography
                            nameSpace="subscriptions"
                            translation="upgradePlan.description"
                        />
                    </CustomGrid>
                }
                onClose={handleCloseSubscriptionPlans}
            />
            <TemplatePreviewDialog
                isNeedToRenderTemplateInfo
                chooseButtonKey="chooseTemplate"
                onChooseTemplate={handleChooseCommonTemplate}
            />
            <DeleteTemplateDialog />
            <ScheduleMeetingDialog />
            <DownloadIcsEventDialog />
            <TimeExpiredDialog />
        </MainProfileWrapper>
    );
};

export const TemplatesContainer = memo(Component);
