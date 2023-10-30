import { memo, useCallback, useEffect, useRef } from 'react';
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
import { TemplateLinks } from '@components/TemplateManagement/TemplateLinks/TemplateLinks';

// hooks
import { useYupValidationResolver } from '@hooks/useYupValidationResolver';
import { useValueSwitcher } from '@hooks/useValueSwitcher';

// types
import { IUploadTemplateFormData } from '@containers/CreateRoomContainer/types';
import { TemplateManagementProps } from '@components/TemplateManagement/TemplateManagement.types';
import {
    customTemplateLinkSchema,
    templatesLinksSchema,
} from 'shared-frontend/validation';
import { ValuesSwitcherItem } from 'shared-frontend/types';
import { Translation } from '@library/common/Translation/Translation';
import { PARTICIPANT_POSITIONS } from 'shared-const';
import {
    MAX_DESCRIPTION_LENGTH,
    MAX_NAME_LENGTH,
} from '../../const/templates/info';
import { dashboardRoute } from '../../const/client-routes';
import {
    $isBusinessSubscription,
    $isProfessionalSubscription,
    addNotificationEvent,
    appDialogsApi,
} from '../../store';
import { AppDialogsEnum, NotificationType } from '../../store/types';

// validation
import {
    booleanSchema,
    simpleStringSchemaWithLength,
} from '../../validation/common';
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

enum TabsValues {
    Background = 1,
    Settings = 2,
    Attendees = 3,
    Links = 4,
    Privacy = 5,
    Preview = 6,
}

const tabs: ValuesSwitcherItem<number>[] = [
    { id: 1, value: TabsValues.Background, label: 'Background' },
    { id: 2, value: TabsValues.Settings, label: 'Settings' },
    {
        id: 3,
        value: TabsValues.Links,
        label: 'Links',
        disabled: true,
        tooltip: (
            <Translation
                nameSpace="createRoom"
                translation="tooltips.upgradeToBusiness"
            />
        ),
    },
    { id: 4, value: TabsValues.Privacy, label: 'Privacy' },
];

const businessUserTabs: ValuesSwitcherItem<number>[] = [
    { id: 1, value: TabsValues.Background, label: 'Background' },
    { id: 2, value: TabsValues.Settings, label: 'Settings' },
    { id: 3, value: TabsValues.Links, label: 'Links' },
    { id: 4, value: TabsValues.Privacy, label: 'Privacy' },
];

const defaultValues: IUploadTemplateFormData = {
    name: '',
    url: '',
    youtubeUrl: '',
    previewUrls: [],
    description: '',
    customLink: '',
    tags: [],
    templateLinks: [],
    participantsNumber: 10,
    participantsPositions: PARTICIPANT_POSITIONS.map(item => ({
        ...item,
        id: getRandomNumber(10000).toString(),
    })),
    isPublic: false,
};

const validationSchema = yup.object({
    name: simpleStringSchemaWithLength(MAX_NAME_LENGTH).required('required'),
    description: simpleStringSchemaWithLength(MAX_DESCRIPTION_LENGTH),
    participantsNumber: participantsNumberSchema().required('required'),
    tags: tagsSchema(),
    isPublic: booleanSchema().required('required'),
    customLink: customTemplateLinkSchema(),
    participantsPositions: participantsPositionsSchema(),
    templateLinks: templatesLinksSchema(),
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

    const resolver = useYupValidationResolver<IUploadTemplateFormData>(
        validationSchema,
        {
            reduceArrayErrors: true,
        },
    );

    const methods = useForm<IUploadTemplateFormData>({
        defaultValues,
        resolver,
        mode: 'onBlur',
    });

    const {
        control,
        setValue,
        trigger,
        handleSubmit: onSubmitForm,
        reset,
    } = methods;

    const name = useWatch({ control, name: 'name' });
    const isPublic = useWatch({ control, name: 'isPublic' });
    const background = useWatch({ control, name: 'background' });
    const previewUrl = useWatch({ control, name: 'url' });
    const youtubeUrl = useWatch({ control, name: 'youtubeUrl' });

    const templateLinks = useWatch({
        control,
        name: 'templateLinks',
    });

    const controlPanelRef = useRef<HTMLDivElement | null>(null);
    const savedTemplateProgress = useRef<IUploadTemplateFormData | null>(null);

    const targetTab = isBusinessSubscription ? businessUserTabs : tabs;

    const {
        activeValue,
        activeItem,
        onValueChange,
        onNextValue,
        onPreviousValue,
    } = useValueSwitcher({
        values: targetTab,
        initialValue: targetTab[0].value,
    });

    const {
        value: isFileUploadRequested,
        onSwitchOn: onRequestFileUpload,
        onSwitchOff: onResetRequestFileUpload,
    } = useToggle(false);
    const { value: isTemplateDataWasSet, onSwitchOn: onSetTemplateData } =
        useToggle(false);

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
    }, [
        background,
        onUploadFile,
        isFileUploadRequested,
        onResetRequestFileUpload,
    ]);

    useEffect(() => {
        if (isTemplateDataWasSet || !template) {
            return;
        }

        reset({
            name: template.name,
            url: template.url,
            description: template.description,
            customLink: template.customLink ?? '',
            tags: template?.businessCategories?.map(item => ({
                ...item,
                label: item.value,
            })),
            participantsNumber: defaultValues.participantsNumber,
            participantsPositions: defaultValues.participantsPositions,
            previewUrls: template.previewUrls.map(({ id }) => id),
            isPublic: template.isPublic,
            templateLinks:
                template.links?.map(link => ({
                    value: link.item,
                    top: link.position.top,
                    left: link.position.left,
                })) || [],
            youtubeUrl: template.mediaLink ? template.mediaLink.src : '',
        });
        onSetTemplateData();
    }, [template, isTemplateDataWasSet]);

    useEffect(() => {
        if (!router.isReady) {
            return;
        }
        if (
            typeof router.query.step === 'string' &&
            activeItem.label.toLowerCase() !== router.query.step
        ) {
            const tab = targetTab.find(
                ({ label }) => label.toLowerCase() === router.query.step,
            );
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
        console.log('#Duy Phan console save', savedProgress);
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
            templateLinks:
                savedProgress?.links?.map(link => ({
                    value: link.item,
                    top: link.position.top,
                    left: link.position.left,
                })) || [],
        });
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
        [onUpgradePlan, isFileUploading],
    );

    const handleValueChange = useCallback(
        async (item: ValuesSwitcherItem<number>) => {
            if (item.value > TabsValues.Background) {
                if (youtubeUrl) {
                    const response = await trigger(['youtubeUrl']);
                    if (!response) {
                        addNotificationEvent({
                            type: NotificationType.BackgroundFileShouldBeUploaded,
                            message: 'errors.invalidUrl',
                            withErrorIcon: true,
                        });
                        return;
                    }
                } else if (!(background || previewUrl)) {
                    addNotificationEvent({
                        type: NotificationType.BackgroundFileShouldBeUploaded,
                        message: 'createRoom.uploadBackground.shouldBeUploaded',
                        withErrorIcon: true,
                    });
                    return;
                }
            }

            if (item.value > TabsValues.Settings) {
                const response = await trigger(['description', 'name', 'tags']);

                if (!response) {
                    return;
                }
            }

            if (item.value > TabsValues.Links) {
                const isLinksValid = await trigger(['templateLinks']);

                if (!isLinksValid) {
                    addNotificationEvent({
                        message: 'errors.invalidUrl',
                        withErrorIcon: true,
                        type: NotificationType.validationError,
                    });
                    onValueChange(tabs[2]);
                    return;
                }
            }

            onValueChange(item);
        },
        [activeItem, onValueChange, background, previewUrl, youtubeUrl],
    );

    const handleOpenCancelConfirmationDialog = useCallback(() => {
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.confirmCancelRoomCreationDialog,
        });
    }, []);

    const handleNextStep = () => {
        if (activeValue === TabsValues.Settings && !isBusinessSubscription)
            onValueChange(tabs[3]);
        else onNextValue();
    };

    const handlePreviousStep = () => {
        if (activeValue === TabsValues.Privacy && !isBusinessSubscription) {
            onValueChange(tabs[1]);
        } else onPreviousValue();
    };

    return (
        <CustomGrid container className={styles.wrapper}>
            <FormProvider {...methods}>
                <form>
                    <TemplateBackgroundPreview
                        isFileUploading={isFileUploading}
                    >
                        <ConditionalRender
                            condition={activeValue === TabsValues.Background}
                        >
                            <UploadTemplateFile onNextStep={handleNextStep} />
                        </ConditionalRender>
                        <ConditionalRender
                            condition={activeValue === TabsValues.Settings}
                        >
                            <EditTemplateDescription
                                template={template}
                                onNextStep={handleNextStep}
                                onPreviousStep={handlePreviousStep}
                            />
                        </ConditionalRender>
                        <ConditionalRender
                            condition={activeValue === TabsValues.Attendees}
                        >
                            <EditAttendeesPosition
                                onNextStep={handleNextStep}
                                onPreviousStep={handlePreviousStep}
                            />
                        </ConditionalRender>
                        <ConditionalRender
                            condition={activeValue === TabsValues.Preview}
                        >
                            <TemplatePreview
                                onPreviousStep={handlePreviousStep}
                                onSubmit={handleSubmit}
                                controlPanelRef={controlPanelRef}
                                templateId={template?.id}
                            />
                        </ConditionalRender>
                        <ConditionalRender
                            condition={activeValue === TabsValues.Privacy}
                        >
                            <EditPrivacy
                                onSubmit={handleSubmit}
                                onPreviousStep={handlePreviousStep}
                                onUpgradePlan={handleUpgradePlanClick}
                            />
                        </ConditionalRender>

                        <ConditionalRender
                            condition={activeValue === TabsValues.Links}
                        >
                            <TemplateLinks
                                links={templateLinks}
                                onNextStep={handleNextStep}
                                onPreviousStep={handlePreviousStep}
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
                                    <ImagePlaceholderIcon
                                        width="34px"
                                        height="34px"
                                    />
                                </CustomGrid>
                                <CustomGrid item>
                                    <CustomPaper
                                        variant="black-glass"
                                        className={styles.mainInfo}
                                    >
                                        <CustomGrid
                                            container
                                            direction="column"
                                        >
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

                                            <CustomGrid
                                                container
                                                wrap="nowrap"
                                                alignItems="center"
                                                gap={0.5}
                                            >
                                                {isPublic ? (
                                                    <PeopleIcon
                                                        width="16px"
                                                        height="16px"
                                                        className={
                                                            styles.privacyIcon
                                                        }
                                                    />
                                                ) : (
                                                    <LockIcon
                                                        width="16px"
                                                        height="16px"
                                                        className={
                                                            styles.privacyIcon
                                                        }
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
                            <CustomGrid
                                item
                                container
                                flex={2}
                                justifyContent="center"
                            >
                                <CustomPaper
                                    variant="black-glass"
                                    className={styles.navigationPaper}
                                >
                                    <ValuesSwitcher<number>
                                        values={targetTab}
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
                                <CustomTooltip
                                    nameSpace="createRoom"
                                    translation="tooltips.cancel"
                                >
                                    <ActionButton
                                        onAction={
                                            handleOpenCancelConfirmationDialog
                                        }
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
