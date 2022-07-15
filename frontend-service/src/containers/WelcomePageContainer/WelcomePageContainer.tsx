import React, { memo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';

// controllers
import { StorageKeysEnum, WebStorage } from '../../controllers/WebStorageController';

// custom
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// components
import { OnboardingTemplateItem } from '@components/Templates/OnboardingTemplateItem/OnboardingTemplateItem';
import { TemplatePreviewDialog } from '@components/Dialogs/TemplatePreviewDialog/TemplatePreviewDialog';
import { TemplatesGrid } from '@components/Templates/TemplatesGrid/TemplatesGrid';

// styles
import styles from './WelcomePageContainer.module.scss';

// stores
import { $templatesStore, getTemplatesFx } from '../../store';

const WelcomePageContainer = memo(() => {
    const router = useRouter();
    const templates = useStore($templatesStore);

    useEffect(() => {
        (async () => {
            await getTemplatesFx({ limit: 6, skip: 0 });
        })();
    }, []);

    const handleStartOnboarding = useCallback(({ templateId }) => {
        WebStorage.save({ key: StorageKeysEnum.templateId, data: { templateId } });

        router.push(`/register`);
    }, []);

    const handleCommonTemplatesPageChange = useCallback(async newPage => {
        await getTemplatesFx({ limit: 6 * newPage, skip: 0 });
    }, []);

    return (
        <>
            <CustomGrid container direction="column" alignItems="center">
                <CustomGrid
                    className={styles.wrapper}
                    container
                    alignItems="center"
                    justifyContent="center"
                >
                    <CustomBox className={styles.image}>
                        <Image
                            src="/images/winking-face.png"
                            width="40px"
                            height="40px"
                            alt="winking-face"
                        />
                    </CustomBox>
                    <CustomTypography variant="h1" nameSpace="welcome" translation="title" />
                </CustomGrid>
                <CustomTypography variant="h4" nameSpace="welcome" translation="text" />
                <TemplatesGrid
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
