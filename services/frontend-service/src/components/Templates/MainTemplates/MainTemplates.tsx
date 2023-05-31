import { memo, useCallback } from 'react';
import styles from './MainTemplates.module.scss';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MenusTemplate } from '../Menus/Menus';
import { TemplatesGrid } from '../TemplatesGrid/TemplatesGrid';
import {
    $profileStore,
    $profileTemplatesCountStore,
    $profileTemplatesStore,
    $templatesStore,
    addTemplateToUserFx,
    deleteProfileTemplateFx,
    getTemplatesFx,
    purchaseTemplateFx,
} from 'src/store';
import { useStore, useStoreMap } from 'effector-react';
import { EntityList, ICommonTemplate, IUserTemplate } from 'shared-types';
import { useRouter } from 'next/router';
import { handleCreateMeeting } from 'src/store/meetings/handlers/handleCreateMeeting';
import { CommonTemplateItem } from '../CommonTemplateItem/CommonTemplateItem';

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

    return (
        <CustomGrid
            className={styles.commonTemplates}
            container
            direction="column"
            justifyContent="center"
        >
            <MenusTemplate />
            <TemplatesGrid<ICommonTemplate>
                list={templates.list}
                count={templates.count}
                onPageChange={handleCommonTemplatesPageChange}
                onChooseTemplate={handleChooseCommonTemplate}
                TemplateComponent={CommonTemplateItem}
            />
        </CustomGrid>
    );
};
export const MainTemplates = memo(Component);
