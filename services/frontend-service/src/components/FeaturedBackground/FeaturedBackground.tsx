import { memo, useCallback } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { $featuredBackgroundStore, $profileStore, $profileTemplatesCountStore, $profileTemplatesStore, $templatesStore, addTemplateToUserFx, createMeetingFx, deleteProfileTemplateFx, purchaseTemplateFx } from 'src/store';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { mapEmoji, parseEmoji } from 'shared-utils';
import { TemplatesGrid } from '@components/Templates/TemplatesGrid/TemplatesGrid';
import { EntityList, ICommonTemplate, IUserTemplate } from 'shared-types';
import { useRouter } from 'next/router';
import { CommonTemplateItem } from '@components/Templates/CommonTemplateItem/CommonTemplateItem';
import { getClientMeetingUrl } from 'src/utils/urls';
import styles from './FeaturedBackground.module.scss';

const Component = () => {
    const { list, count } = useStore($featuredBackgroundStore);
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

    return (
        <CustomGrid
            container
            direction="column"
            className={styles.featuredWrapper}
        >
            <CustomPaper className={styles.barge}>
                <CustomGrid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                >
                    <CustomGrid fontSize={20} paddingRight={1}>
                        {parseEmoji(mapEmoji('2728'))}
                    </CustomGrid>
                    <CustomTypography
                        fontSize={14}
                        nameSpace="templates"
                        translation="featuredRooms.title"
                    />
                </CustomGrid>
            </CustomPaper>
            <TemplatesGrid<ICommonTemplate>
                list={list}
                count={count}
                onChooseTemplate={handleChooseCommonTemplate}
                TemplateComponent={CommonTemplateItem}
            />
        </CustomGrid>
    );
};

export const FeaturedBackground = memo(Component);
