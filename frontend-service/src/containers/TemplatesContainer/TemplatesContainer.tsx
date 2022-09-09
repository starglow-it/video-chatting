import React, { memo, useCallback, useLayoutEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { useStore, useStoreMap } from 'effector-react';

// hooks
import { useTemplateNotification } from '@hooks/useTemplateNotification';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';

// components
import { MainProfileWrapper } from '@library/common/MainProfileWrapper/MainProfileWrapper';
import { CommonTemplateItem } from '@components/Templates/CommonTemplateItem/CommonTemplateItem';
import { TemplatesGrid } from '@components/Templates/TemplatesGrid/TemplatesGrid';
import { ProfileTemplateItem } from '@components/Templates/ProfileTemplateItem/ProfileTemplateItem';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// dialogs
import { TemplatePreviewDialog } from '@components/Dialogs/TemplatePreviewDialog/TemplatePreviewDialog';
import { DeleteTemplateDialog } from '@components/Dialogs/DeleteTemplateDialog/DeleteTemplateDialog';
import { ScheduleMeetingDialog } from '@components/Dialogs/ScheduleMeetingDialog/ScheduleMeetingDialog';
import { DownloadIcsEventDialog } from '@components/Dialogs/DownloadIcsEventDialog/DownloadIcsEventDialog';
import { ReplaceTemplateDialog } from '@components/Dialogs/ReplaceTemplateDialog/ReplaceTemplateDialog';
import { TimeExpiredDialog } from '@components/Dialogs/TimeExpiredDialog/TimeExpiredDialog';

// stores
import {
    $isBusinessSubscription,
    $profileStore,
    $profileTemplatesStore,
    $skipProfileTemplates,
    $templatesStore,
    appDialogsApi,
    createMeetingFx,
    deleteProfileTemplateFx,
    getProfileTemplatesFx,
    getTemplatesFx,
    purchaseTemplateFx,
    setReplaceTemplateIdEvent,
    setSkipProfileTemplates,
} from '../../store';

// styles
import styles from './TemplatesContainer.module.scss';

// types
import { AppDialogsEnum, Template, UserTemplate } from '../../store/types';

// utils
import { getClientMeetingUrl } from '../../utils/urls';
import { formatCountDown } from '../../utils/time/formatCountdown';
import { dashboardRoute } from '../../const/client-routes';

const Component = () => {
    const router = useRouter();

    const profileTemplates = useStore($profileTemplatesStore);
    const templates = useStore($templatesStore);
    const skipProfileTemplates = useStore($skipProfileTemplates);
    const profile = useStore($profileStore);
    const isBusinessSubscription = useStore($isBusinessSubscription);

    const freeTemplatesCount = useStoreMap({
        store: $profileTemplatesStore,
        keys: [],
        fn: state => state?.list?.filter(template => template.type === 'free')?.length || 0,
    });

    const isTemplateDeleting = useStore(deleteProfileTemplateFx.pending);

    useTemplateNotification(dashboardRoute);

    useLayoutEffect(() => {
        (async () => {
            await getTemplatesFx({ limit: 6, skip: 0 });
        })();
    }, []);

    useLayoutEffect(() => {
        (async () => {
            if (!isTemplateDeleting) {
                await getProfileTemplatesFx({ limit: skipProfileTemplates, skip: 0 });
            }
        })();
    }, [isTemplateDeleting]);

    const isThereProfileTemplates = Boolean(profileTemplates?.list?.length);

    const handleProfileTemplatesPageChange = useCallback(async (newPage: number) => {
        await getProfileTemplatesFx({ limit: 6 * newPage, skip: 0 });

        setSkipProfileTemplates(6 * newPage);
    }, []);

    const handleCommonTemplatesPageChange = useCallback(async (newPage: number) => {
        await getTemplatesFx({ limit: 6 * newPage, skip: 0 });
    }, []);

    const handleCreateMeeting = async ({ templateId }) => {
        const result = await createMeetingFx({ templateId });

        if (result.template) {
            await router.push(
                getClientMeetingUrl(result.template?.customLink || result?.template?.id),
            );
        }
    };

    const handleChooseCommonTemplate = async (templateId: Template['id']) => {
        const targetTemplate = templates?.list?.find(template => template.id === templateId);

        if (targetTemplate?.type === 'paid') {
            const response = await purchaseTemplateFx({ templateId });

            router.push(response.url);

            return;
        }

        if (profile.maxTemplatesNumber === freeTemplatesCount) {
            setReplaceTemplateIdEvent(templateId);

            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.replaceTemplateConfirmDialog,
            });

            return;
        }

        await handleCreateMeeting({ templateId });
    };

    const handleReplaceTemplate = async ({
        templateId,
        deleteTemplateId,
    }: {
        deleteTemplateId: UserTemplate['id'];
        templateId: Template['id'];
    }) => {
        const targetTemplate = templates?.list?.find(template => template.id === templateId);

        if (targetTemplate?.type === 'paid') {
            const response = await purchaseTemplateFx({ templateId });

            router.push(response.url);

            return;
        }

        deleteProfileTemplateFx({ templateId: deleteTemplateId });

        await handleCreateMeeting({ templateId });
    };

    const handleChooseProfileTemplate = async (templateId: UserTemplate['id']) => {
        await handleCreateMeeting({ templateId });
    };

    const timeLimit = formatCountDown(profile.maxMeetingTime, {
        hours: true,
        minutes: true,
        numeric: false,
    });

    const templatesLimit = `${freeTemplatesCount}/${profile.maxTemplatesNumber}`;

    return (
        <MainProfileWrapper>
            <ConditionalRender condition={isThereProfileTemplates}>
                <CustomGrid container direction="column" justifyContent="center">
                    <CustomGrid container alignItems="center" justifyContent="center">
                        <CustomBox className={styles.image}>
                            <Image
                                src="/images/ok-hand.png"
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
                        <ConditionalRender condition={!isBusinessSubscription}>
                            <CustomTypography
                                color="colors.grayscale.semidark"
                                nameSpace="subscriptions"
                                translation="limits.time"
                                options={{ timeLimit }}
                            />
                            &nbsp;
                            <CustomTypography color="colors.grayscale.semidark">
                                &#8226;
                            </CustomTypography>
                        </ConditionalRender>
                        &nbsp;
                        <CustomTypography
                            color="colors.grayscale.semidark"
                            nameSpace="subscriptions"
                            translation="limits.templates"
                            options={{ templatesLimit }}
                        />
                    </CustomGrid>
                    <TemplatesGrid<UserTemplate>
                        list={profileTemplates.list}
                        count={profileTemplates.count}
                        onPageChange={handleProfileTemplatesPageChange}
                        onChooseTemplate={handleChooseProfileTemplate}
                        TemplateComponent={ProfileTemplateItem}
                    />
                </CustomGrid>
            </ConditionalRender>
            <CustomGrid
                className={clsx(styles.commonTemplates, {
                    [styles.noProfileTemplates]: !isThereProfileTemplates,
                })}
                container
                direction="column"
                justifyContent="center"
            >
                <CustomGrid container alignItems="center" justifyContent="center">
                    <CustomBox className={styles.image}>
                        <Image
                            src="/images/blush-face.png"
                            width="40px"
                            height="40px"
                            alt="blush-face"
                        />
                    </CustomBox>
                    <CustomTypography
                        variant="h1"
                        nameSpace="templates"
                        translation="selectTemplates"
                    />
                </CustomGrid>
                <TemplatesGrid<Template>
                    list={templates.list}
                    count={templates.count}
                    onPageChange={handleCommonTemplatesPageChange}
                    onChooseTemplate={handleChooseCommonTemplate}
                    TemplateComponent={CommonTemplateItem}
                />
            </CustomGrid>
            <TemplatePreviewDialog
                isNeedToRenderTemplateInfo
                chooseButtonKey="chooseTemplate"
                onChooseTemplate={handleChooseCommonTemplate}
            />
            <DeleteTemplateDialog />
            <ScheduleMeetingDialog />
            <DownloadIcsEventDialog />
            <ReplaceTemplateDialog onReplaceTemplate={handleReplaceTemplate} />
            <TimeExpiredDialog />
        </MainProfileWrapper>
    );
};

export const TemplatesContainer = memo(Component);
