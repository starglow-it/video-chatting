import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import { Fade } from '@mui/material';
import clsx from 'clsx';

// hooks
import { useToggle } from '@hooks/useToggle';

// custom
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';

// components
import { TemplatesGrid } from '@components/Templates/TemplatesGrid/TemplatesGrid';
import { ReplaceTemplateItem } from '@components/Templates/ReplaceTemplateItem/ReplaceTemplateItem';

// stores
import { EntityList, ICommonTemplate, IUserTemplate } from 'shared-types';
import { Translation } from '@library/common/Translation/Translation';
import {
    $appDialogsStore,
    $deleteProfileTemplateId,
    $profileStore,
    $profileTemplatesStore,
    $replaceTemplateIdStore,
    appDialogsApi,
    getProfileTemplatesFx,
    setDeleteTemplateIdEvent,
    setReplaceTemplateIdEvent,
    setSkipProfileTemplates,
} from '../../../store';

// styles
import styles from './ReplaceTemplateDialog.module.scss';

// types
import { AppDialogsEnum } from '../../../store/types';

const Component = ({
    onReplaceTemplate,
}: {
    onReplaceTemplate: (data: {
        deleteTemplateId: IUserTemplate['id'];
        templateId: ICommonTemplate['id'];
    }) => void;
}) => {
    const { replaceTemplateConfirmDialog } = useStore($appDialogsStore);
    const deleteProfileTemplateId = useStore($deleteProfileTemplateId);
    const replaceTemplateId = useStore($replaceTemplateIdStore);
    const profile = useStore($profileStore);

    const [elementHeight, setElementHeight] = useState(0);

    const messageRef = useRef<HTMLDivElement | null>(null);
    const replaceRef = useRef<HTMLDivElement | null>(null);

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

    const {
        value: isReplaceStep,
        onToggleSwitch: handleToggleReplaceStep,
        onSwitchOff: handleResetSwitch,
    } = useToggle(false);

    useEffect(() => {
        const messageContainerHeight =
            messageRef?.current?.getBoundingClientRect?.()?.height || 176;
        const replaceContainerHeight =
            replaceRef?.current?.getBoundingClientRect?.()?.height || 0;

        setElementHeight(
            isReplaceStep ? replaceContainerHeight : messageContainerHeight,
        );
    }, [isReplaceStep]);

    const handleClose = useCallback(() => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.replaceTemplateConfirmDialog,
        });
        handleResetSwitch();
    }, []);

    const handleStartReplace = useCallback(() => {
        handleToggleReplaceStep();
    }, []);

    const handleProfileTemplatesPageChange = useCallback(
        async (newPage: number) => {
            await getProfileTemplatesFx({
                limit: 6 * newPage,
                skip: 0,
            });

            setSkipProfileTemplates(6 * newPage);
        },
        [],
    );

    const handleChooseProfileTemplate = (templateId: IUserTemplate['id']) => {
        setDeleteTemplateIdEvent(templateId);
    };

    const handleReplaceTemplate = async () => {
        appDialogsApi.closeDialog({
            dialogKey: AppDialogsEnum.replaceTemplateConfirmDialog,
        });

        setDeleteTemplateIdEvent('');
        setReplaceTemplateIdEvent('');

        handleResetSwitch();

        onReplaceTemplate?.({
            templateId: replaceTemplateId,
            deleteTemplateId: deleteProfileTemplateId,
        });
    };

    const style = {
        '--height': `${elementHeight}px`,
    } as React.CSSProperties;

    return (
        <CustomDialog
            onClose={handleClose}
            open={replaceTemplateConfirmDialog}
            contentClassName={styles.wrapper}
        >
            <CustomGrid container className={styles.content} style={style}>
                <Fade in={!isReplaceStep} unmountOnExit>
                    <CustomGrid
                        className={styles.info}
                        container
                        justifyContent="center"
                        direction="column"
                        ref={messageRef}
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
                            options={{
                                maxTemplates: profile.maxTemplatesNumber,
                            }}
                        />
                        <CustomGrid container wrap="nowrap" gap={2}>
                            <CustomButton
                                onClick={handleClose}
                                variant="custom-cancel"
                                label={
                                    <Translation
                                        nameSpace="common"
                                        translation="buttons.cancel"
                                    />
                                }
                            />
                            <CustomButton
                                onClick={handleStartReplace}
                                label={
                                    <Translation
                                        nameSpace="common"
                                        translation="buttons.continue"
                                    />
                                }
                            />
                        </CustomGrid>
                    </CustomGrid>
                </Fade>
                <Fade in={isReplaceStep} timeout={200} unmountOnExit>
                    <CustomGrid
                        className={styles.templates}
                        container
                        direction="column"
                        wrap="nowrap"
                        ref={replaceRef}
                    >
                        <CustomTypography
                            className={styles.title}
                            textAlign="center"
                            variant="h4bold"
                            nameSpace="dashboard"
                            translation="replaceTemplate.titleSecond"
                        />
                        <TemplatesGrid<IUserTemplate>
                            itemWidth={124}
                            itemGap={1.25}
                            outerClassName={styles.templatesOuterWrapper}
                            innerClassName={styles.templatesInnerWrapper}
                            list={freeTemplates}
                            count={freeTemplates?.length}
                            onPageChange={handleProfileTemplatesPageChange}
                            onChooseTemplate={handleChooseProfileTemplate}
                            TemplateComponent={ReplaceTemplateItem}
                        />

                        <CustomGrid
                            className={clsx(styles.buttons, {
                                [styles.withSlider]: freeTemplates?.length > 6,
                            })}
                            container
                            wrap="nowrap"
                            gap={2}
                        >
                            <CustomButton
                                onClick={handleClose}
                                variant="custom-cancel"
                                label={
                                    <Translation
                                        nameSpace="common"
                                        translation="buttons.cancel"
                                    />
                                }
                            />
                            <CustomButton
                                onClick={handleReplaceTemplate}
                                label={
                                    <Translation
                                        nameSpace="common"
                                        translation="buttons.replace"
                                    />
                                }
                                disabled={!deleteProfileTemplateId}
                            />
                        </CustomGrid>
                    </CustomGrid>
                </Fade>
            </CustomGrid>
        </CustomDialog>
    );
};

export const ReplaceTemplateDialog = memo(Component);
