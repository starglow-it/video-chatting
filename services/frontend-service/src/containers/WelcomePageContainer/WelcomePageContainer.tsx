import React, { memo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useStore } from 'effector-react';

import { ICommonTemplate, RoomType } from 'shared-types';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';

// components
import { OnboardingTemplateItem } from '@components/Templates/OnboardingTemplateItem/OnboardingTemplateItem';
import { TemplatePreviewDialog } from '@components/Dialogs/TemplatePreviewDialog/TemplatePreviewDialog';
import { TemplatesGrid } from '@components/Templates/TemplatesGrid/TemplatesGrid';
import {
    StorageKeysEnum,
    WebStorage,
} from '../../controllers/WebStorageController';

// styles
import styles from './WelcomePageContainer.module.scss';

// stores
import {
    $templatesStore,
    getBusinessCategoriesFx,
    getFeaturedBackgroundFx,
    getTemplatesFx,
    setQueryTemplatesEvent,
} from '../../store';
import { FeaturedBackground } from '@components/FeaturedBackground/FeaturedBackground';
import { MenusWelcome } from '@components/Templates/MenusWelcome/MenusWelcome';

const baseTemplateParams = {
    type: 'free',
    draft: false,
    isPublic: true,
    sort: 'maxParticipants',
    direction: 1,
};

const WelcomePageContainer = memo(() => {
    const router = useRouter();

    const templates = useStore($templatesStore);

    useEffect(() => {
        setQueryTemplatesEvent({
            skip: 0,
            ...baseTemplateParams,
        });
    }, []);

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

    const handleStartOnboarding = useCallback(
        (templateId: ICommonTemplate['id']) => {
            WebStorage.save({
                key: StorageKeysEnum.templateId,
                data: { templateId },
            });

            router.push(`/register`);
        },
        [],
    );

    const handleCommonTemplatesPageChange = useCallback(
        async (newPage: number) => {
            await getTemplatesFx({
                limit: 6 * newPage,
                skip: 0,
                ...baseTemplateParams,
            });
        },
        [],
    );

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
                <FeaturedBackground />
                <MenusWelcome />
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
