import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useStore } from 'effector-react';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { useToggle } from 'shared-frontend/hooks/useToggle';

// icons
import { ImagePlaceholderIcon } from 'shared-frontend/icons/OtherIcons/ImagePlaceholderIcon';
import { PeopleIcon } from 'shared-frontend/icons/OtherIcons/PeopleIcon';
import { LockIcon } from 'shared-frontend/icons/OtherIcons/LockIcon';
import { CloseIcon } from 'shared-frontend/icons/OtherIcons/CloseIcon';

// library
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { ValuesSwitcher } from 'shared-frontend/library/common/ValuesSwitcher';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';

// components
import { ConfirmCancelRoomCreationDialog } from '@components/Dialogs/ConfirmCancelRoomCreationDialog/ConfirmCancelRoomCreationDialog';
import { TemplateBackgroundPreview } from '@components/TemplateManagement/TemplateBackgroundPreview/TemplateBackgroundPreview';
import { UploadTemplateFile } from '@components/TemplateManagement/UploadTemplateFile/UploadTemplateFile';
import { EditTemplateDescription } from '@components/TemplateManagement/EditTemplateDescription/EditTemplateDescription';
import { EditAttendeesPosition } from '@components/TemplateManagement/EditAttendeesPosition/EditAttendeesPosition';
import { TemplatePreview } from '@components/TemplateManagement/TemplatePreview/TemplatePreview';
import { EditPrivacy } from '@components/TemplateManagement/EditPrivacy/EditPrivacy';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';
import { useValueSwitcher } from '@hooks/useValueSwitcher';
import { usePrevious } from '@hooks/usePrevious';

// types
import { IUploadTemplateFormData } from '@containers/CreateRoomContainer/types';
import { TemplateManagementProps } from '@components/TemplateManagement/TemplateManagement.types';
import { customTemplateLinkSchema } from 'shared-frontend/validation';
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from '../../const/templates/info';
import { dashboardRoute } from '../../const/client-routes';
import {
    $isBusinessSubscription,
    $isProfessionalSubscription,
    addNotificationEvent,
    appDialogsApi,
} from '../../store';
import { AppDialogsEnum, NotificationType } from '../../store/types';

// validation
import { booleanSchema, simpleStringSchemaWithLength } from '../../validation/common';
import {
    participantsNumberSchema,
    participantsPositionsSchema,
} from '../../validation/templates/participants';
import { tagsSchema } from '../../validation/templates/tags';

// styles
import styles from './TemplateManagement.module.scss';

// utils
import { getRandomNumber } from '../../utils/numbers/getRandomNumber';
import { parseBase64 } from '../../utils/string/parseBase64';
import {ValuesSwitcherItem} from "shared-frontend/types";

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
    customLink: customTemplateLinkSchema(),
    participantsPositions: participantsPositionsSchema(),
});

const Component = ({
    template,
    onCancel,
    onSubmit,
    onUploadFile,
    onUpgradePlan,
    isFileUploading,
}: TemplateManagementProps) => {
    const isBusinessSubscription = useStore($isBusinessSubscription);
    const isProfessionalSubscription = useStore($isProfessionalSubscription);

    const router = useRouter();

    const resolver = useYupValidationResolver<IUploadTemplateFormData>(validationSchema, {
        reduceArrayErrors: true,
    });

    const methods = useForm<IUploadTemplateFormData>({
        defaultValues,
        resolver,
        mode: 'onBlur',
    });

    const { control, setValue, trigger, handleSubmit: onSubmitForm, reset } = methods;

    const participantsNumber = useWatch({ control, name: 'participantsNumber' });
    const participantsPositions = useWatch({ control, name: 'participantsPositions' });
    const name = useWatch({ control, name: 'name' });
    const isPublic = useWatch({ control, name: 'isPublic' });
    const background = useWatch({ control, name: 'background' });
    const previewUrl = useWatch({ control, name: 'url' });

    const previousParticipantsNumber = usePrevious(participantsNumber);

    const controlPanelRef = useRef<HTMLDivElement | null>(null);
    const savedTemplateProgress = useRef<IUploadTemplateFormData | null>(null);

    const { activeValue, activeItem, onValueChange, onNextValue, onPreviousValue } =
        useValueSwitcher({
            values: tabs,
            initialValue: tabs[0].value,
        });

    const {
        value: isFileUploadRequested,
        onSwitchOn: onRequestFileUpload,
        onSwitchOff: onResetRequestFileUpload,
    } = useToggle(false);
    const {
        value: preventNextParticipantsPositionsUpdate,
        onSwitchOn: onPreventNextParticipantsPositionsUpdate,
        onSwitchOff: onResetPreventNextParticipantsPositionsUpdate,
    } = useToggle(false);
    const { value: isTemplateDataWasSet, onSwitchOn: onSetTemplateData } = useToggle(false);

    useEffect(() => {
        if (!isBusinessSubscription && !isProfessionalSubscription) {
            router.push(dashboardRoute);
        }
    }, [isBusinessSubscription, isProfessionalSubscription]);

    useEffect(() => {
        if (!background) {
            return;
        }

        onRequestFileUpload();
    }, [background, onRequestFileUpload]);

    useEffect(() => {
        if (!isFileUploadRequested) {
            return;
        }

        if (!background) {
            onResetRequestFileUpload();
            return;
        }

        (async () => {
            const response = await onUploadFile(background);

            onResetRequestFileUpload();

            if (!response) {
                return;
            }

            if (response.draftPreviewUrls) {
                setValue(
                    'previewUrls',
                    response.draftPreviewUrls.map(({ id }) => id),
                );
            }

            if (response.draftUrl) {
                setValue('url', response.draftUrl);
            }
        })();
    }, [background, onUploadFile, isFileUploadRequested, onResetRequestFileUpload]);

    useEffect(() => {
        if (isTemplateDataWasSet || !template) {
            return;
        }

        reset({
            name: template.name,
            url: template.url,
            description: template.description,
            customLink: template.customLink ?? '',
            tags: template?.businessCategories?.map(item => ({ ...item, label: item.value })),
            participantsNumber: template.maxParticipants,
            participantsPositions: template.usersPosition.length
                ? template.usersPosition.map(({ bottom, left }) => ({
                      top: 100 - bottom * 100,
                      left: left * 100,
                      id: getRandomNumber(10000).toString(),
                  }))
                : defaultValues.participantsPositions,
            previewUrls: template.previewUrls.map(({ id }) => id),
            isPublic: template.isPublic,
        });
        if (template.maxParticipants > 1) {
            onPreventNextParticipantsPositionsUpdate();
        }
        onSetTemplateData();
    }, [template, isTemplateDataWasSet]);

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
        if (!router.isReady) {
            return;
        }
        if (
            typeof router.query.step === 'string' &&
            activeItem.label.toLowerCase() !== router.query.step
        ) {
            const tab = tabs.find(({ label }) => label.toLowerCase() === router.query.step);
            if (tab) {
                onValueChange(tab);
            }
        }
        if (typeof router.query.data === 'string') {
            savedTemplateProgress.current = parseBase64(
                router.query.data,
            ) as IUploadTemplateFormData;
        }
    }, [router.isReady, onValueChange]);

    useEffect(() => {
        if (!savedTemplateProgress.current) {
            return;
        }

        const savedProgress = savedTemplateProgress.current;
        reset({
            name: savedProgress.name,
            url: savedProgress.url,
            description: savedProgress.description,
            customLink: savedProgress.customLink,
            tags: savedProgress.tags,
            participantsNumber: savedProgress.participantsNumber,
            participantsPositions: savedProgress.participantsPositions,
            previewUrls: savedProgress.previewUrls,
            isPublic: savedProgress.isPublic,
        });
        if (savedProgress.participantsNumber > 1) {
            onPreventNextParticipantsPositionsUpdate();
        }
    }, [isTemplateDataWasSet]);

    const handleSubmit = useCallback(
        onSubmitForm(async data => {
            if (isFileUploading) {
                addNotificationEvent({
                    type: NotificationType.BackgroundFileIsNotUploadedYet,
                    message: 'createRoom.uploadBackground.isPending',
                });
                return;
            }
            onSubmit(data);
        }),
        [onSubmit, isFileUploading],
    );

    const handleUpgradePlanClick = useCallback(
        onSubmitForm(async data => {
            if (isFileUploading) {
                addNotificationEvent({
                    type: NotificationType.BackgroundFileIsNotUploadedYet,
                    message: 'createRoom.uploadBackground.isPending',
                });
                return;
            }
            onUpgradePlan(data);
        }),
        [onSubmit, isFileUploading],
    );

    const handleValueChange = useCallback(
        async (item: ValuesSwitcherItem<number>) => {
            if (item.value > TabsValues.Background && !(background || previewUrl)) {
                addNotificationEvent({
                    type: NotificationType.BackgroundFileShouldBeUploaded,
                    message: 'uploadBackground.shouldBeUploaded',
                    withErrorIcon: true,
                });
                return;
            }
            if (item.value > TabsValues.Settings) {
                const response = await trigger();
                onValueChange(response ? item : tabs[1]);
                return;
            }

            onValueChange(item);
        },
        [onValueChange, background, previewUrl],
    );

    const handleOpenCancelConfirmationDialog = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.confirmCancelRoomCreationDialog,
        });
    }, []);

    return (
        <CustomGrid container className={styles.wrapper}>
            <FormProvider {...methods}>
                <form>
                    <TemplateBackgroundPreview isFileUploading={isFileUploading}>
                        <ConditionalRender condition={activeValue === TabsValues.Background}>
                            <UploadTemplateFile onNextStep={onNextValue} />
                        </ConditionalRender>
                        <ConditionalRender condition={activeValue === TabsValues.Settings}>
                            <EditTemplateDescription
                                template={template}
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
                                templateId={template?.id}
                            />
                        </ConditionalRender>
                        <ConditionalRender condition={activeValue === TabsValues.Privacy}>
                            <EditPrivacy
                                onNextStep={onNextValue}
                                onPreviousStep={onPreviousValue}
                                onUpgradePlan={handleUpgradePlanClick}
                            />
                        </ConditionalRender>

                        <CustomGrid
                            ref={controlPanelRef}
                            container
                            flexWrap="nowrap"
                            alignItems="flex-start"
                            justifyContent="stretch"
                            gap={1.5}
                            className={styles.controlPanel}
                        >
                            <CustomGrid
                                container
                                flex={1}
                                item
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
                            <CustomGrid item container flex={2} justifyContent="center">
                                <CustomPaper
                                    variant="black-glass"
                                    className={styles.navigationPaper}
                                >
                                    <ValuesSwitcher<number>
                                        values={tabs}
                                        activeValue={activeItem}
                                        onValueChanged={handleValueChange}
                                        variant="transparent"
                                    />
                                </CustomPaper>
                            </CustomGrid>
                            <CustomGrid
                                item
                                container
                                flex={1}
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
            <ConfirmCancelRoomCreationDialog onConfirm={onCancel} />
        </CustomGrid>
    );
};

export const TemplateManagement = memo(Component);
