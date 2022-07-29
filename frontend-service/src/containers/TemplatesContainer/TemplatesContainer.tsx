import React, { memo, useCallback, useEffect } from 'react';
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
import { TemplatePreviewDialog } from '@components/Dialogs/TemplatePreviewDialog/TemplatePreviewDialog';
import { CommonTemplateItem } from '@components/Templates/CommonTemplateItem/CommonTemplateItem';
import { TemplatesGrid } from '@components/Templates/TemplatesGrid/TemplatesGrid';
import { ProfileTemplateItem } from '@components/Templates/ProfileTemplateItem/ProfileTemplateItem';
import { DeleteTemplateDialog } from '@components/Dialogs/DeleteTemplateDialog/DeleteTemplateDialog';
import { ScheduleMeetingDialog } from '@components/Dialogs/ScheduleMeetingDialog/ScheduleMeetingDialog';
import { DownloadIcsEventDialog } from '@components/Dialogs/DownloadIcsEventDialog/DownloadIcsEventDialog';

// stores
import { createMeetingFx } from '../../store';
import {
    $profileTemplatesStore,
    $skipProfileTemplates,
    setSkipProfileTemplates,
    deleteProfileTemplateFx,
    getProfileTemplatesFx,
} from '../../store';
import { $templatesStore, getTemplatesFx } from '../../store';

// styles
import styles from './TemplatesContainer.module.scss';

const TemplatesContainer = memo(() => {
    const router = useRouter();

    const profileTemplates = useStore($profileTemplatesStore);
    const templates = useStore($templatesStore);
    const skipProfileTemplates = useStore($skipProfileTemplates);

    const isTemplateDeleting = useStore(deleteProfileTemplateFx.pending);

    useEffect(() => {
        (async () => {
            await getTemplatesFx({ limit: 6, skip: 0 });
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (!isTemplateDeleting) {
                await getProfileTemplatesFx({ limit: skipProfileTemplates, skip: 0 });
            }
        })();
    }, [isTemplateDeleting]);

    const handleChooseTemplate = useCallback(async ({ templateId }) => {
        const result = await createMeetingFx({ templateId });

        if (result.template) {
            await router.push(`/meeting/${result.template?.customLink || result?.template?.id}`);
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

    return (
        <MainProfileWrapper>
            {isThereProfileTemplates && (
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
                    <TemplatesGrid
                        list={profileTemplates.list}
                        count={profileTemplates.count}
                        onPageChange={handleProfileTemplatesPageChange}
                        TemplateComponent={ProfileTemplateItem}
                    />
                </CustomGrid>
            )}
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
        </MainProfileWrapper>
    );
});

export { TemplatesContainer };
