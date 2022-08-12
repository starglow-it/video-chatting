import React, { memo, useCallback, useLayoutEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { useStore } from 'effector-react';

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
    $isOwner,
    $profileStore,
    $profileTemplatesStore,
    $skipProfileTemplates,
    $templatesStore,
    appDialogsApi,
    createMeetingFx,
    deleteProfileTemplateFx,
    getProfileTemplatesFx,
    getTemplatesFx,
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

const TemplatesContainer = memo(() => {
    const router = useRouter();

    const profileTemplates = useStore($profileTemplatesStore);
    const templates = useStore($templatesStore);
    const skipProfileTemplates = useStore($skipProfileTemplates);
    const profile = useStore($profileStore);
    const isOwner = useStore($isOwner);

    const isTemplateDeleting = useStore(deleteProfileTemplateFx.pending);

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

    const handleChooseTemplate = useCallback(async ({ templateId }) => {
        const result = await createMeetingFx({ templateId });

        if (result.template) {
            await router.push(
                getClientMeetingUrl(result.template?.customLink || result?.template?.id),
            );
        }
    }, []);

    const isThereProfileTemplates = Boolean(profileTemplates?.list?.length);

    const handleProfileTemplatesPageChange = useCallback(async newPage => {
        await getProfileTemplatesFx({ limit: 6 * newPage, skip: 0 });
        setSkipProfileTemplates(6 * newPage);
    }, []);

    const handleCommonTemplatesPageChange = useCallback(async newPage => {
        await getTemplatesFx({ limit: 6 * newPage, skip: 0 });
    }, []);

    const handleChooseCommonTemplate = async (templateId: Template['id']) => {
        if (profile.maxTemplatesNumber === profileTemplates.count) {
            setReplaceTemplateIdEvent(templateId);

            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.replaceTemplateConfirmDialog,
            });

            return;
        }

        const result = await createMeetingFx({ templateId });

        if (result.template) {
            await router.push(
                getClientMeetingUrl(result.template?.customLink || result?.template?.id),
            );
        }
    };

    const handleChooseProfileTemplate = async (templateId: UserTemplate['id']) => {
        const result = await createMeetingFx({ templateId });

        if (result.template) {
            await router.push(
                getClientMeetingUrl(result.template?.customLink || result?.template?.id || ''),
            );
        }
    };

    const timeLimit = formatCountDown(profile.maxMeetingTime, { hours: true, minutes: true });

    const templatesLimit = `${profileTemplates.count}/${profile.maxTemplatesNumber}`;

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
                        &nbsp;
                        <CustomTypography
                            color="colors.grayscale.semidark"
                            nameSpace="subscriptions"
                            translation="limits.templates"
                            options={{ templatesLimit }}
                        />
                    </CustomGrid>
                    <TemplatesGrid
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
                <TemplatesGrid
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
                onChooseTemplate={handleChooseTemplate}
            />
            <DeleteTemplateDialog />
            <ScheduleMeetingDialog />
            <DownloadIcsEventDialog />
            <ReplaceTemplateDialog />

            <ConditionalRender condition={isOwner}>
                <TimeExpiredDialog />
            </ConditionalRender>
        </MainProfileWrapper>
    );
});

export { TemplatesContainer };
