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

// stores
import { createMeetingFx } from '../../store/meetings';
import { $profileStore, $profileTemplatesStore, getProfileTemplatesFx } from '../../store/profile';
import { $templatesStore, getTemplatesFx } from '../../store/templates';

// styles
import styles from './TemplatesContainer.module.scss';

const TemplatesContainer = memo(() => {
    const router = useRouter();

    const profile = useStore($profileStore);
    const profileTemplates = useStore($profileTemplatesStore);
    const templates = useStore($templatesStore);

    useEffect(() => {
        (async () => {
            await getProfileTemplatesFx({ limit: 6, skip: 0 });
            await getTemplatesFx({ limit: 6, skip: 0 });
        })();
    }, []);

    const handleChooseTemplate = useCallback(async ({ templateId }) => {
        const result = await createMeetingFx({ templateId });

        if (result.meeting) {
            await router.push(`/meeting/${result.meeting.id}`);
        }
    }, []);

    const isThereProfileTemplates = Boolean(profile?.templates?.length);

    const handleProfileTemplatesPageChange = useCallback(async newPage => {
        await getProfileTemplatesFx({ limit: 6 * newPage, skip: 0 });
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
        </MainProfileWrapper>
    );
});

export { TemplatesContainer };
