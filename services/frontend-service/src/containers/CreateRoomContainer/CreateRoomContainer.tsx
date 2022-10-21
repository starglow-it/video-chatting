import React, { memo, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';

// hooks
import { useSubscriptionNotification } from '@hooks/useSubscriptionNotification';
import { useToggle } from '@hooks/useToggle';
import { useValueSwitcher } from '@hooks/useValueSwitcher';
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';
import { usePrevious } from '@hooks/usePrevious';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { WiggleLoader } from '@library/common/WiggleLoader/WiggleLoader';

// components
import { ValuesSwitcher } from '@library/common/ValuesSwitcher/ValuesSwitcher';
import { UploadTemplateFile } from '@components/CreateRoom/UploadTemplateFile/UploadTemplateFile';
import { TemplateBackgroundPreview } from '@components/CreateRoom/TemplateBackgroundPreview/TemplateBackgroundPreview';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';
import { ConfirmCancelRoomCreationDialog } from '@components/Dialogs/ConfirmCancelRoomCreationDialog/ConfirmCancelRoomCreationDialog';
import { EditTemplateDescription } from '@components/CreateRoom/EditTemplateDescription/EditTemplateDescription';
import { EditAttendeesPosition } from '@components/CreateRoom/EditAttendeesPosition/EditAttendeesPosition';
import { TemplatePreview } from '@components/CreateRoom/TemplatePreview/TemplatePreview';
import { EditPolicy } from '@components/CreateRoom/EditPrivacy/EditPolicy';

// icons
import { CloseIcon } from '@library/icons/CloseIcon';
import { ImagePlaceholderIcon } from '@library/icons/ImagePlaceholderIcon';
import { PeopleIcon } from '@library/icons/PeopleIcon';
import { LockIcon } from '@library/icons/LockIcon';

// const
import { createRoomRoute, dashboardRoute } from 'src/const/client-routes';
import {
    MAX_CUSTOM_LINK_LENGTH,
    MAX_DESCRIPTION_LENGTH,
    MAX_NAME_LENGTH,
} from 'src/const/templates/info';

// types
import { ValuesSwitcherItem } from '@library/common/ValuesSwitcher/types';
import { IUploadTemplateFormData } from '@containers/CreateRoomContainer/types';
import { AppDialogsEnum, UserTemplate } from '../../store/types';

// validation
import { booleanSchema, simpleStringSchemaWithLength } from '../../validation/common';
import { tagsSchema } from '../../validation/templates/tags';
import {
    participantsNumberSchema,
    participantsPositionsSchema,
} from '../../validation/templates/participants';

// store
import {
    $isBusinessSubscription,
    $isProfessionalSubscription,
    $templateDraft,
    addTemplateToUserFx,
    appDialogsApi,
    clearTemplateDraft,
    createTemplateFx,
    editTemplateFx,
    editUserTemplateFx,
    getEditingTemplateFx,
    getSubscriptionWithDataFx,
    initLandscapeListener,
    initWindowListeners,
    removeLandscapeListener,
    removeWindowListeners,
    uploadTemplateFileFx,
    uploadUserTemplateFileFx,
} from '../../store';

// utils
import { getRandomNumber } from '../../utils/numbers/getRandomNumber';

// styles
import styles from './CreateRoomContainer.module.scss';

enum TabsValues {
    Background = 1,
    Settings = 2,
    Attendees = 3,
    Privacy = 4,
    Preview = 5,
}

const tabs: ValuesSwitcherItem<number>[] = [
    { id: 1, value: TabsValues.Background, label: 'Background' },
    { id: 2, value: TabsValues.Settings, label: 'Settings' },
    { id: 3, value: TabsValues.Attendees, label: 'Attendees' },
    { id: 4, value: TabsValues.Privacy, label: 'Privacy' },
    { id: 5, value: TabsValues.Preview, label: 'Preview' },
];

const defaultValues: IUploadTemplateFormData = {
    name: '',
    url: '',
    previewUrls: [],
    description: '',
    customLink: '',
    tags: [],
    participantsNumber: 1,
    participantsPositions: [{ left: 50, top: 50, id: '1' }],
    isPublic: false,
};

const validationSchema = yup.object({
    name: simpleStringSchemaWithLength(MAX_NAME_LENGTH).required('required'),
    description: simpleStringSchemaWithLength(MAX_DESCRIPTION_LENGTH).required('required'),
    participantsNumber: participantsNumberSchema().required('required'),
    tags: tagsSchema(),
    isPublic: booleanSchema().required('required'),
    customLink: simpleStringSchemaWithLength(MAX_CUSTOM_LINK_LENGTH),
    participantsPositions: participantsPositionsSchema(),
});

const adjustUserPositions = (participantsPositions: { top: number; left: number }[]) =>
    participantsPositions.map(({ top, left }) => ({
        bottom: (100 - top) / 100,
        left: left / 100,
    }));

const Component = ({ isEditing = false }: { isEditing: boolean }) => {
    const isBusinessSubscription = useStore($isBusinessSubscription);
    const isProfessionalSubscription = useStore($isProfessionalSubscription);
    const templateDraft = useStore($templateDraft);
    const isCreateTemplateRequestIsPending = useStore(createTemplateFx.pending);

    const router = useRouter();

    const resolver = useYupValidationResolver<IUploadTemplateFormData>(validationSchema, {
        reduceArrayErrors: true,
    });

    const methods = useForm<IUploadTemplateFormData>({
        defaultValues,
        resolver,
        mode: 'onBlur',
    });

    const { control, setValue, trigger, handleSubmit: onSubmit, reset } = methods;

    const participantsNumber = useWatch({ control, name: 'participantsNumber' });
    const participantsPositions = useWatch({ control, name: 'participantsPositions' });
    const name = useWatch({ control, name: 'name' });
    const isPublic = useWatch({ control, name: 'isPublic' });
    const background = useWatch({ control, name: 'background' });

    const previousParticipantsNumber = usePrevious(participantsNumber);
    const prevTemplateDataRef = useRef<UserTemplate | null>(null);

    const controlPanelRef = useRef<HTMLDivElement | null>(null);

    const { value: isTemplateDataWasSet, onSwitchOn: onSetTemplateData } = useToggle(false);
    const {
        value: preventNextParticipantsPositionsUpdate,
        onSwitchOn: onPreventNextParticipantsPositionsUpdate,
        onSwitchOff: onResetPreventNextParticipantsPositionsUpdate,
    } = useToggle(false);

    const { activeValue, activeItem, onValueChange, onNextValue, onPreviousValue } =
        useValueSwitcher({
            values: tabs,
            initialValue: tabs[0].value,
        });

    useSubscriptionNotification(createRoomRoute);

    useEffect(() => {
        (async () => {
            if (!router.isReady) {
                return;
            }
            const { templateId } = router.query;
            if (templateId && typeof templateId === 'string') {
                const response = await getEditingTemplateFx({ templateId, withCredentials: true });

                if (response) {
                    prevTemplateDataRef.current = response;
                }
            } else {
                createTemplateFx();
            }
        })();
    }, [router.isReady]);

    useEffect(() => {
        if (isTemplateDataWasSet || !templateDraft) {
            return;
        }

        reset({
            name: templateDraft.name,
            url: templateDraft.url,
            description: templateDraft.description,
            customLink: templateDraft.customLink ?? '',
            tags: templateDraft.businessCategories.map(item => ({ ...item, label: item.value })),
            participantsNumber: templateDraft.maxParticipants,
            participantsPositions: templateDraft.usersPosition.length
                ? templateDraft.usersPosition.map(({ bottom, left }) => ({
                      top: 100 - bottom * 100,
                      left: left * 100,
                      id: getRandomNumber(10000).toString(),
                  }))
                : defaultValues.participantsPositions,
            previewUrls: templateDraft.previewUrls,
            isPublic: templateDraft.isPublic,
        });
        if (isEditing && templateDraft.maxParticipants > 1) {
            onPreventNextParticipantsPositionsUpdate();
        }
        onSetTemplateData();
    }, [templateDraft, isEditing, isTemplateDataWasSet]);

    useEffect(() => () => clearTemplateDraft(), []);

    useEffect(() => {
        if (!previousParticipantsNumber || participantsNumber === previousParticipantsNumber) {
            return;
        }
        if (preventNextParticipantsPositionsUpdate) {
            onResetPreventNextParticipantsPositionsUpdate();
            return;
        }

        if (previousParticipantsNumber > participantsNumber) {
            setValue('participantsPositions', participantsPositions.slice(0, participantsNumber));
            return;
        }

        const newPositions = [...participantsPositions];
        for (let i = 0; i < participantsNumber - previousParticipantsNumber; i += 1) {
            newPositions.push({
                left: 50,
                top: 50,
                id: getRandomNumber(10000).toString(),
            });
        }
        setValue('participantsPositions', newPositions);
    }, [
        participantsNumber,
        previousParticipantsNumber,
        participantsPositions,
        preventNextParticipantsPositionsUpdate,
    ]);

    useEffect(() => {
        (async () => {
            if (!background || !templateDraft?.id) {
                return;
            }

            const response = isEditing
                ? await uploadUserTemplateFileFx({
                      templateId: templateDraft.id,
                      file: background,
                  })
                : await uploadTemplateFileFx({
                      file: background,
                      templateId: templateDraft.id,
                  });

            if (!response) {
                return;
            }

            if (response.draftPreviewUrls) {
                setValue('previewUrls', response.draftPreviewUrls);
            }

            if (response.draftUrl) {
                setValue('url', response.draftUrl);
            }
        })();
    }, [background, isEditing]);

    useEffect(() => {
        getSubscriptionWithDataFx();
    }, []);

    useEffect(() => {
        if (!isBusinessSubscription && !isProfessionalSubscription) {
            router.push(dashboardRoute);
        }
    }, [isBusinessSubscription, isProfessionalSubscription]);

    useLayoutEffect(() => {
        initWindowListeners();
        initLandscapeListener();

        return () => {
            removeWindowListeners();
            removeLandscapeListener();
        };
    }, []);

    const handleValueChange = useCallback(
        async (item: ValuesSwitcherItem<number>) => {
            if (item.value > TabsValues.Settings) {
                const response = await trigger();
                onValueChange(response ? item : tabs[1]);
                return;
            }

            onValueChange(item);
        },
        [onValueChange],
    );

    const handleCancelRoomCreation = useCallback(async () => {
        if (isEditing) {
            if (prevTemplateDataRef.current && templateDraft?.id) {
                await editUserTemplateFx({
                    templateId: templateDraft.id,
                    data: prevTemplateDataRef.current,
                });
            }
        }
        // TODO: delete common template if canceled and other data associated with it
        router.push(dashboardRoute);
    }, [templateDraft]);

    const handleOpenCancelConfirmationDialog = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.confirmCancelRoomCreationDialog,
        });
    }, []);

    const handleSubmit = useCallback(
        onSubmit(async data => {
            const payload = {
                name: data.name,
                description: data.description,
                customLink: data.customLink,
                isPublic: data.isPublic,
                maxParticipants: data.participantsNumber,
                usersPosition: adjustUserPositions(data.participantsPositions),
                businessCategories: data.tags,
                draft: false,
                url: data.url,
                previewUrls: data.previewUrls.map(({ id }) => id),
            };

            if (templateDraft?.id) {
                if (isEditing) {
                    await editUserTemplateFx({
                        templateId: templateDraft.id,
                        data: payload,
                    });
                } else {
                    await editTemplateFx({
                        templateId: templateDraft.id,
                        data: payload,
                    });

                    const userTemplate = await addTemplateToUserFx({
                        templateId: templateDraft.id,
                    });

                    const { businessCategories, ...newPayload } = payload;

                    if (userTemplate?.id) {
                        await editUserTemplateFx({
                            templateId: userTemplate.id,
                            data: newPayload,
                        });
                    }
                }

                await router.push(dashboardRoute);
            }
        }),
        [isEditing, templateDraft?.id],
    );

    if (isCreateTemplateRequestIsPending) {
        return (
            <CustomGrid container className={styles.wrapper}>
                <WiggleLoader className={styles.loader} />
            </CustomGrid>
        );
    }

    return (
        <CustomGrid container className={styles.wrapper}>
            <FormProvider {...methods}>
                <form>
                    <TemplateBackgroundPreview>
                        <ConditionalRender condition={activeValue === TabsValues.Background}>
                            <UploadTemplateFile onNextStep={onNextValue} />
                        </ConditionalRender>
                        <ConditionalRender condition={activeValue === TabsValues.Settings}>
                            <EditTemplateDescription
                                onNextStep={onNextValue}
                                onPreviousStep={onPreviousValue}
                            />
                        </ConditionalRender>
                        <ConditionalRender condition={activeValue === TabsValues.Attendees}>
                            <EditAttendeesPosition
                                onNextStep={onNextValue}
                                onPreviousStep={onPreviousValue}
                            />
                        </ConditionalRender>
                        <ConditionalRender condition={activeValue === TabsValues.Preview}>
                            <TemplatePreview
                                onPreviousStep={onPreviousValue}
                                onSubmit={handleSubmit}
                                controlPanelRef={controlPanelRef}
                            />
                        </ConditionalRender>
                        <ConditionalRender condition={activeValue === TabsValues.Privacy}>
                            <EditPolicy onNextStep={onNextValue} onPreviousStep={onPreviousValue} />
                        </ConditionalRender>

                        <CustomGrid
                            ref={controlPanelRef}
                            container
                            flexWrap="nowrap"
                            alignItems="flex-start"
                            justifyContent="stretch"
                            className={styles.controlPanel}
                        >
                            <CustomGrid
                                container
                                xs={3}
                                item
                                width="100%"
                                flexWrap="nowrap"
                                alignItems="center"
                                gap={1.5}
                            >
                                <CustomGrid
                                    item
                                    container
                                    flexShrink={0}
                                    alignItems="center"
                                    justifyContent="center"
                                    className={styles.iconPlaceholder}
                                >
                                    <ImagePlaceholderIcon width="34px" height="34px" />
                                </CustomGrid>
                                <CustomGrid item>
                                    <CustomPaper variant="black-glass" className={styles.mainInfo}>
                                        <CustomGrid container direction="column">
                                            {name ? (
                                                <CustomTypography
                                                    color="colors.white.primary"
                                                    className={styles.name}
                                                >
                                                    {name}
                                                </CustomTypography>
                                            ) : (
                                                <CustomTypography
                                                    color="colors.white.primary"
                                                    nameSpace="createRoom"
                                                    translation="preview.roomName"
                                                    className={styles.name}
                                                />
                                            )}

                                            <CustomGrid container alignItems="center" gap={0.5}>
                                                {isPublic ? (
                                                    <PeopleIcon
                                                        width="16px"
                                                        height="16px"
                                                        className={styles.privacyIcon}
                                                    />
                                                ) : (
                                                    <LockIcon
                                                        width="16px"
                                                        height="16px"
                                                        className={styles.privacyIcon}
                                                    />
                                                )}
                                                <CustomTypography
                                                    variant="body2"
                                                    nameSpace="createRoom"
                                                    translation={
                                                        isPublic
                                                            ? 'preview.type.public'
                                                            : 'preview.type.private'
                                                    }
                                                    className={styles.type}
                                                />
                                            </CustomGrid>
                                        </CustomGrid>
                                    </CustomPaper>
                                </CustomGrid>
                            </CustomGrid>
                            <CustomGrid item container flex={0} xs={6} justifyContent="center">
                                <CustomPaper
                                    variant="black-glass"
                                    className={styles.navigationPaper}
                                >
                                    <ValuesSwitcher<number>
                                        values={tabs}
                                        optionWidth={115}
                                        activeValue={activeItem}
                                        onValueChanged={handleValueChange}
                                        variant="transparent"
                                    />
                                </CustomPaper>
                            </CustomGrid>
                            <CustomGrid
                                item
                                container
                                xs={3}
                                width="100%"
                                justifyContent="flex-end"
                            >
                                <CustomTooltip nameSpace="createRoom" translation="tooltips.cancel">
                                    <ActionButton
                                        onAction={handleOpenCancelConfirmationDialog}
                                        Icon={
                                            <CloseIcon
                                                className={styles.closeIcon}
                                                width="40px"
                                                height="40px"
                                            />
                                        }
                                        className={styles.closeButton}
                                        variant="gray"
                                    />
                                </CustomTooltip>
                            </CustomGrid>
                        </CustomGrid>
                    </TemplateBackgroundPreview>
                </form>
            </FormProvider>
            <ConfirmCancelRoomCreationDialog onConfirm={handleCancelRoomCreation} />
        </CustomGrid>
    );
};

export const CreateRoomContainer = memo(Component);
