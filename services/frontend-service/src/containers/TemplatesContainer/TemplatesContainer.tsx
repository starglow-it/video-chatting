import { memo, useCallback, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useStore, useStoreMap } from 'effector-react';
import dynamic from 'next/dynamic';
const Joyride = dynamic(() => import('react-joyride'), { ssr: false });

// hooks
import { useTemplateNotification } from '@hooks/useTemplateNotification';

// components
import { MainProfileWrapper } from '@components/MainProfileWrapper/MainProfileWrapper';

// dialogs
import { TemplatePreviewDialog } from '@components/Dialogs/TemplatePreviewDialog/TemplatePreviewDialog';
import { DeleteTemplateDialog } from '@components/Dialogs/DeleteTemplateDialog/DeleteTemplateDialog';
import { ScheduleMeetingDialog } from '@components/Dialogs/ScheduleMeetingDialog/ScheduleMeetingDialog';
import { DownloadIcsEventDialog } from '@components/Dialogs/DownloadIcsEventDialog/DownloadIcsEventDialog';
import { WelcomeTourDialog } from '@components/Dialogs/WelcomeTourDialog/WelcomeTourDialog';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

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
    $joyrideStore,
    emitDashboardJoyrideEvent,
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

    const [isFirstDashboardVisit, setIsFirstDashboardVisit] = useState(false);
    const { runDashboardJoyride } = useStore($joyrideStore);
    const [stepIndex, setStepIndex] = useState(0);

    const createContentWithLineBreaks = text => {
        return text.split('\n').map((line, index, array) => (
            <span key={index}>
              {line}
              {index !== array.length - 1 && <br />}
            </span>
          ));
    };

    const joyrideStyleOptions = {
        arrowColor: "#FF884E",
        backgroundColor: "#9243B7",
        textColor: "#fff",
        fontSize: "20px",
        zIndex: 100,
        primaryColor: "#FF884E",
    };

    const joyrideSteps = [
        {
            target: "#profileAvatarIcon",
            title: "profile",
            content: createContentWithLineBreaks("edit your profiel and avatar,\n manage your sucscription \n and monetization here."),
            disableBeacon: true
        },
        {
            target: "#templatesMenu",
            title: "ruume's",
            content: createContentWithLineBreaks("browser pre-made ruume's \n by category."),
            disableBeacon: true

        },
        {
            target: "#templateCreate",
            title: "create a ruume",
            content: createContentWithLineBreaks("personalize your very own \n ruume. \n\n create a unique aesthetic and \n vid eo calling experience to your \n preference."),
            disableBeacon: true
        },
        {
            target: "#featuredTemplates",
            title: "featured ruumes",
            content: createContentWithLineBreaks("enjoy using seasonal, exclusive backgrounds for your ruume."),
            disableBeacon: true
        },
    ];

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

    useEffect(() => {
        const isFirstDashboardVisit = localStorage.getItem("isFirstDashboardVisit");

        if (isFirstDashboardVisit) {
            setIsFirstDashboardVisit(true);
            localStorage.removeItem("isFirstDashboardVisit");
        } else {
            setIsFirstDashboardVisit(false);
        }
    }, []);

    const handleCreateMeeting = useCallback(
        async ({ templateId }: { templateId: ICommonTemplate['id'] }) => {
            const result = await createMeetingFx({ templateId });

            if (result.template) {
                const newPageUrl = await getClientMeetingUrl(
                    result.template?.customLink || result?.template?.id,
                );

                window.open(newPageUrl, '_blank');
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

    const handleSetVisitedDashboard = () => {
        setIsFirstDashboardVisit(false);

        if (localStorage.getItem("isFirstDashboardVisit")) {
            localStorage.removeItem("isFirstDashboardVisit");
        }
    };

    const handleJoyrideCallback = (data) => {
        const { action, index, type } = data;
        const joyrideEl = document.querySelector(".react-joyride__overlay")

        if (joyrideEl) {
            if (index <= joyrideSteps.length - 1) {
                joyrideEl.addEventListener("click", () => setStepIndex(index + 1));
            } else {
                setStepIndex(0);
                emitDashboardJoyrideEvent({ runDashboardJoyride: false });
            }
        }

        if (type === 'step:after') {
            setStepIndex(index + 1);
        }

        if (type === 'tour:end' || action === 'close') {
            emitDashboardJoyrideEvent({ runDashboardJoyride: false });
        }

    };

    return (
        <MainProfileWrapper>
            <Joyride
                callback={handleJoyrideCallback}
                steps={joyrideSteps}
                stepIndex={stepIndex}
                run={runDashboardJoyride}
                continuous={true}
                disableOverlayClose={true}
                styles={{
                    tooltip: {
                        borderRadius: 20
                    },
                    tooltipTitle: {
                        marginLeft: "10px",
                        fontSize: "20px",
                        textAlign: "left"
                    },
                    tooltipContent: {
                        fontSize: "20px",
                        textAlign: "left"
                    },
                    tooltipFooter: {
                        justifyContent: "flex-start",
                        paddingLeft: "10px"
                    },
                    tooltipFooterSpacer: {
                        display: "none"
                    },
                    options: { ...joyrideStyleOptions }
                }}
                hideBackButton
                locale={{ next: <ArrowForwardIosIcon fontSize="small" />, last: "finish" }}
            />
            <FeaturedBackground onChooseTemplate={handleChooseCommonTemplate} />
            <MainTemplates />
            <TemplatePreviewDialog
                isNeedToRenderTemplateInfo
                chooseButtonKey="chooseTemplate"
                onChooseTemplate={handleChooseCommonTemplate}
            />
            <WelcomeTourDialog isFirstDashboardVisit={isFirstDashboardVisit} handleSetVisitedDashboard={handleSetVisitedDashboard} />
            <DeleteTemplateDialog />
            <ScheduleMeetingDialog isScheduleDash />
            <DownloadIcsEventDialog />
        </MainProfileWrapper>
    );
};

export const TemplatesContainer = memo(Component);
