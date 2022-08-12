import React, { memo, useCallback } from 'react';
import { useStore } from 'effector-react';
import clsx from 'clsx';
import { Fade } from '@mui/material';
import { useRouter } from 'next/router';

// hooks
import { useToggle } from '@hooks/useToggle';

// custom
import { CustomDialog } from '@library/custom/CustomDialog/CustomDialog';
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { TemplatesGrid } from '@components/Templates/TemplatesGrid/TemplatesGrid';
import { ReplaceTemplateItem } from '@components/Templates/ReplaceTemplateItem/ReplaceTemplateItem';

// stores
import {
    $appDialogsStore,
    $deleteProfileTemplateId,
    $profileStore,
    $profileTemplatesStore,
    $replaceTemplateIdStore,
    appDialogsApi,
    createMeetingFx,
    deleteProfileTemplateFx,
    getProfileTemplatesFx,
    setDeleteTemplateIdEvent,
    setReplaceTemplateIdEvent,
    setSkipProfileTemplates,
} from '../../../store';

// styles
import styles from './ReplaceTemplateDialog.module.scss';

// types
import { AppDialogsEnum, UserTemplate } from '../../../store/types';
import { getClientMeetingUrl } from '../../../utils/urls';

const Component = () => {
    const router = useRouter();

    const { replaceTemplateConfirmDialog } = useStore($appDialogsStore);
    const profileTemplates = useStore($profileTemplatesStore);
    const deleteProfileTemplateId = useStore($deleteProfileTemplateId);
    const replaceTemplateId = useStore($replaceTemplateIdStore);
    const profile = useStore($profileStore);

    const {
        value: isReplaceStep,
        onToggleSwitch: handleToggleReplaceStep,
        onSwitchOff: handleResetSwitch,
    } = useToggle(false);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.replaceTemplateConfirmDialog,
        });
        handleResetSwitch();
    }, []);

    const handleStartReplace = useCallback(() => {
        handleToggleReplaceStep();
    }, []);

    const handleProfileTemplatesPageChange = useCallback(async newPage => {
        await getProfileTemplatesFx({ limit: 6 * newPage, skip: 0 });

        setSkipProfileTemplates(6 * newPage);
    }, []);

    const handleChooseProfileTemplate = (templateId: UserTemplate['id']) => {
        setDeleteTemplateIdEvent(templateId);
    };

    const handleReplaceTemplate = async () => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.replaceTemplateConfirmDialog,
        });

        setDeleteTemplateIdEvent('');
        setReplaceTemplateIdEvent('');

        handleResetSwitch();

        deleteProfileTemplateFx({ templateId: deleteProfileTemplateId });

        const result = await createMeetingFx({ templateId: replaceTemplateId });

        if (result.template) {
            await router.push(getClientMeetingUrl(result?.template?.id));
        }
    };

    return (
        <CustomDialog
            onClose={handleClose}
            open={replaceTemplateConfirmDialog}
            contentClassName={clsx(styles.wrapper, { [styles.replace]: isReplaceStep })}
        >
            <CustomGrid container sx={{ position: 'relative' }}>
                <Fade in={!isReplaceStep}>
                    <CustomGrid
                        className={styles.info}
                        container
                        justifyContent="center"
                        direction="column"
                    >
                        <CustomTypography
                            textAlign="center"
                            variant="h4bold"
                            nameSpace="dashboard"
                            translation="replaceTemplate.title"
                        />
                        <CustomTypography
                            textAlign="center"
                            className={styles.text}
                            nameSpace="dashboard"
                            translation="replaceTemplate.text"
                            options={{ maxTemplates: profile.maxTemplatesNumber }}
                        />
                        <CustomGrid container wrap="nowrap" gap={2}>
                            <CustomButton
                                onClick={handleClose}
                                variant="custom-cancel"
                                nameSpace="common"
                                translation="buttons.cancel"
                            />
                            <CustomButton
                                onClick={handleStartReplace}
                                nameSpace="common"
                                translation="buttons.continue"
                            />
                        </CustomGrid>
                    </CustomGrid>
                </Fade>
                <Fade in={isReplaceStep} timeout={200}>
                    <CustomGrid
                        className={styles.templates}
                        container
                        direction="column"
                        wrap="nowrap"
                    >
                        <CustomTypography
                            className={styles.title}
                            textAlign="center"
                            variant="h4bold"
                            nameSpace="dashboard"
                            translation="replaceTemplate.titleSecond"
                        />
                        <TemplatesGrid
                            itemWidth={124}
                            itemGap={1.25}
                            outerClassName={styles.templatesOuterWrapper}
                            innerClassName={styles.templatesInnerWrapper}
                            list={profileTemplates.list}
                            count={profileTemplates.count}
                            onPageChange={handleProfileTemplatesPageChange}
                            onChooseTemplate={handleChooseProfileTemplate}
                            TemplateComponent={ReplaceTemplateItem}
                        />

                        <CustomGrid className={styles.buttons} container wrap="nowrap" gap={2}>
                            <CustomButton
                                onClick={handleClose}
                                variant="custom-cancel"
                                nameSpace="common"
                                translation="buttons.cancel"
                            />
                            <CustomButton
                                onClick={handleReplaceTemplate}
                                nameSpace="common"
                                translation="buttons.replace"
                            />
                        </CustomGrid>
                    </CustomGrid>
                </Fade>
            </CustomGrid>
        </CustomDialog>
    );
};

export const ReplaceTemplateDialog = memo(Component);
