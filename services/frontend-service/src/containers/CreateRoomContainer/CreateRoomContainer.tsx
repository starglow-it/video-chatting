import React, { memo, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';

// hooks
import { useSubscriptionNotification } from '@hooks/useSubscriptionNotification';

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

// hooks
import { useValueSwitcher } from '@hooks/useValueSwitcher';
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';
import { usePrevious } from '@hooks/usePrevious';

// icons
import { CloseIcon } from '@library/icons/CloseIcon';
import { ImagePlaceholderIcon } from '@library/icons/ImagePlaceholderIcon';
import { PeopleIcon } from '@library/icons/PeopleIcon';
import { LockIcon } from '@library/icons/LockIcon';

// const
import { createRoomRoute, dashboardRoute } from 'src/const/client-routes';
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from 'src/const/templates/info';

// types
import { ValuesSwitcherItem } from '@library/common/ValuesSwitcher/types';
import { IUploadTemplateFormData } from '@containers/CreateRoomContainer/types';
import { useToggle } from '@hooks/useToggle';
import { AppDialogsEnum } from '../../store/types';

// validation
import { booleanSchema, simpleStringSchemaWithLength } from '../../validation/common';
import { tagsSchema } from '../../validation/templates/tags';
import { participantsNumberSchema } from '../../validation/templates/participants';

// store
import {
    $isBusinessSubscription,
    $isProfessionalSubscription,
    $templateDraft,
    appDialogsApi,
    createMeetingFx,
    createTemplateFx,
    editTemplateFx,
    getEditingTemplateFx,
    getSubscriptionWithDataFx,
    initLandscapeListener,
    initWindowListeners,
    removeLandscapeListener,
    removeWindowListeners,
    uploadTemplateFileFx,
    uploadUserTemplateFileFx,
    editUserTemplateFileFx,
    clearTemplateDraft,
} from '../../store';

// utils
import { getRandomNumber } from '../../utils/numbers/getRandomNumber';

// styles
import styles from './CreateRoomContainer.module.scss';

const tabsValues: ValuesSwitcherItem[] = [
    { id: 1, value: 'background', label: 'Background' },
    { id: 2, value: 'description', label: 'Description' },
    { id: 3, value: 'attendees', label: 'Attendees' },
    { id: 4, value: 'privacy', label: 'Privacy' },
    { id: 5, value: 'preview', label: 'Preview' },
];

const defaultValues: IUploadTemplateFormData = {
    templateId: '',
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
});

const Component = ({ isEditing = false }: { isEditing?: boolean }) => {
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

    const { control, setValue, handleSubmit: onSubmit, reset, watch } = methods;

    const participantsNumber = useWatch({ control, name: 'participantsNumber' });
    const participantsPositions = useWatch({ control, name: 'participantsPositions' });
    const name = useWatch({ control, name: 'name' });
    const isPublic = useWatch({ control, name: 'isPublic' });
    const background = useWatch({ control, name: 'background' });

    const previousParticipantsNumber = usePrevious(participantsNumber);

    const controlPanelRef = useRef<HTMLDivElement | null>(null);

    const { value: isTemplateDataWasSet, onSwitchOn: onSetTemplateData } = useToggle(false);
    const {
        value: preventNextParticipantsPositionsUpdate,
        onSwitchOn: onPreventNextParticipantsPositionsUpdate,
        onSwitchOff: onResetPreventNextParticipantsPositionsUpdate,
    } = useToggle(false);

    const { activeValue, activeItem, onValueChange, onNextValue, onPreviousValue } =
        useValueSwitcher({
            values: tabsValues,
            initialValue: tabsValues[0].value,
        });

    useSubscriptionNotification(createRoomRoute);

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        const { templateId } = router.query;
        if (templateId && typeof templateId === 'string') {
            getEditingTemplateFx({ templateId });
        } else {
            createTemplateFx();
        }
    }, [router.isReady]);

    useEffect(() => {
        if (isTemplateDataWasSet || !templateDraft) {
            return;
        }

        reset({
            templateId: templateDraft.id,
            name: templateDraft.name,
            url: templateDraft.url,
            description: templateDraft.description,
            customLink: templateDraft.customLink ?? '',
            tags: templateDraft.businessCategories.map(({ value }) => value),
            participantsNumber: templateDraft.maxParticipants,
            participantsPositions: templateDraft.usersPosition.length
                ? templateDraft.usersPosition.map(({ bottom, left }) => ({
                    top: 100 - bottom,
                    left,
                    id: getRandomNumber(10000).toString(),
                })) : defaultValues.participantsPositions,
            previewUrls: templateDraft.previewUrls,
            isPublic: templateDraft.isPublic,
        });
        if (isEditing && (templateDraft.maxParticipants > 1)) {
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
    }, [participantsNumber, previousParticipantsNumber, participantsPositions, preventNextParticipantsPositionsUpdate]);

    useEffect(() => {
        (async () => {
            if (!background || !templateDraft?.id) {
                return;
            }
            const templateId = watch('templateId');
            const response = isEditing
                ? await uploadUserTemplateFileFx({
                      templateId,
                      data: {
                          file: background,
                      },
                  })
                : await uploadTemplateFileFx({ file: background, id: templateDraft.id });
            if (!response) {
                return;
            }
            setValue('previewUrls', response.draftPreviewUrls);
            setValue('url', response.draftUrl);
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

    const handleCancelRoomCreation = useCallback(() => {
        router.push(dashboardRoute);
    }, []);

    const handleOpenCancelConfirmationDialog = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.confirmCancelRoomCreationDialog,
        });
    }, []);

    const handleSubmit = useCallback(
        onSubmit(async data => {
            const payload = {
                id: data.templateId,
                name: data.name,
                description: data.description,
                customLink: data.customLink,
                isPublic: data.isPublic,
                maxParticipants: data.participantsNumber,
                usersPosition: data.participantsPositions.map(({ top, left }) => ({
                    bottom: 100 - top,
                    left,
                })),
                businessCategories: data.tags,
                draft: false,
                url: data.url,
                previewUrls: data.previewUrls.map(({ id }) => id),
            };
            const response = isEditing
                ? await editUserTemplateFileFx({ templateId: data.templateId, data: payload })
                : await editTemplateFx(payload);

            if (response) {
                if (isEditing) {
                    router.push(dashboardRoute);
                    return;
                }

                const result = await createMeetingFx({ templateId: data.templateId });

                if (result.template) {
                    router.push(dashboardRoute);
                }
            }
        }),
        [isEditing],
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
                        <ConditionalRender condition={activeValue === 'background'}>
                            <UploadTemplateFile onNextStep={onNextValue} />
                        </ConditionalRender>
                        <ConditionalRender condition={activeValue === 'description'}>
                            <EditTemplateDescription
                                onNextStep={onNextValue}
                                onPreviousStep={onPreviousValue}
                            />
                        </ConditionalRender>
                        <ConditionalRender condition={activeValue === 'attendees'}>
                            <EditAttendeesPosition
                                onNextStep={onNextValue}
                                onPreviousStep={onPreviousValue}
                            />
                        </ConditionalRender>
                        <ConditionalRender condition={activeValue === 'preview'}>
                            <TemplatePreview
                                onPreviousStep={onPreviousValue}
                                onSubmit={handleSubmit}
                                controlPanelRef={controlPanelRef}
                            />
                        </ConditionalRender>
                        <ConditionalRender condition={activeValue === 'privacy'}>
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
                                            <CustomTypography
                                                color="colors.white.primary"
                                                className={styles.name}
                                            >
                                                {name}
                                            </CustomTypography>
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
                                    <ValuesSwitcher
                                        values={tabsValues}
                                        optionWidth={115}
                                        activeValue={activeItem}
                                        onValueChanged={onValueChange}
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
