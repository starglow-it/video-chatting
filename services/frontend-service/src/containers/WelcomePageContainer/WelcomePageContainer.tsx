import React, { memo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';

import { ICommonTemplate } from 'shared-types';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { OnboardingTemplateItem } from '@components/Templates/OnboardingTemplateItem/OnboardingTemplateItem';
import { TemplatePreviewDialog } from '@components/Dialogs/TemplatePreviewDialog/TemplatePreviewDialog';
import { TemplatesGrid } from '@components/Templates/TemplatesGrid/TemplatesGrid';
import { StorageKeysEnum, WebStorage } from '../../controllers/WebStorageController';

// styles
import styles from './WelcomePageContainer.module.scss';

// stores
import { $templatesStore, getTemplatesFx } from '../../store';

const WelcomePageContainer = memo(() => {
    const router = useRouter();
    const templates = useStore($templatesStore);

    useEffect(() => {
        (async () => {
            await getTemplatesFx({
                limit: 6,
                skip: 0,
                type: 'free',
                draft: false,
                isPublic: true
            });
        })();
    }, []);

    const handleStartOnboarding = useCallback((templateId: ICommonTemplate['id']) => {
        WebStorage.save({ key: StorageKeysEnum.templateId, data: { templateId } });

        router.push(`/register`);
    }, []);

    const handleCommonTemplatesPageChange = useCallback(async (newPage: number) => {
        await getTemplatesFx({ limit: 6 * newPage, skip: 0, type: 'free' });
    }, []);

    return (
        <>
            <CustomGrid
                container
                direction="column"
                alignItems="center"
                sx={{
                    padding: '94px 20px 100px 20px',
                }}
            >
                <CustomGrid
                    className={styles.wrapper}
                    container
                    alignItems="center"
                    justifyContent="center"
                >
                    <CustomBox className={styles.image}>
                        <CustomImage
                            src="/images/winking-face.webp"
                            width="40px"
                            height="40px"
                            alt="winking-face"
                        />
                    </CustomBox>
                    <CustomTypography variant="h1" nameSpace="welcome" translation="title" />
                </CustomGrid>
                <CustomTypography variant="h4" nameSpace="welcome" translation="text" />
                <TemplatesGrid<ICommonTemplate>
                    list={templates.list}
                    count={templates.count}
                    onPageChange={handleCommonTemplatesPageChange}
                    TemplateComponent={OnboardingTemplateItem}
                />
            </CustomGrid>
            <TemplatePreviewDialog
                isNeedToRenderTemplateInfo
                chooseButtonKey="chooseTemplate"
                onChooseTemplate={handleStartOnboarding}
            />
        </>
    );
});

export { WelcomePageContainer };
