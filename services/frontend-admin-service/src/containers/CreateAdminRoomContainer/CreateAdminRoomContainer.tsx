import React, {memo, useCallback, useEffect} from 'react';
import {FormProvider, useForm, useWatch} from 'react-hook-form';
import * as yup from "yup";
import { useStore } from 'effector-react';
import {useRouter} from "next/router";
import {Fade} from "@mui/material";

// shared
import {
    ActionButton,
    CloseIcon,
    CustomGrid,
    CustomPaper,
    CustomTooltip,
    ValuesSwitcher,
    ValuesSwitcherItem
} from "shared-frontend";
import {useValueSwitcher, useYupValidationResolver} from "shared-frontend/hooks";
import {
    participantsNumberSchema,
    participantsPositionsSchema,
    simpleStringSchema,
    simpleStringSchemaWithLength,
    tagsSchema
} from "shared-frontend/validation";
import {MAX_DESCRIPTION_LENGTH} from "shared-const";

// components
import {TemplateBackground} from "@components/CreateRoom/TemplateBackground/TemplateBackground";
import {Translation} from "@components/Translation/Translation";
import {UploadBackground} from "@components/CreateRoom/UploadBackground/UploadBackground";
import {CommonTemplateSettings} from "@components/CreateRoom/CommonTemplateSettings/CommonTemplateSettings";
import { AttendeesPositions } from '@components/CreateRoom/AttendeesPositions/AttendeesPositions';

// stores
import {
    $businessCategoriesStore,
    $commonTemplateStore,
    addNotificationEvent,
    getBusinessCategoriesFx,
    getCommonTemplateFx,
    initWindowListeners,
    removeWindowListeners,
    openAdminDialogEvent,
    uploadTemplateFileFx
} from "../../store";

// styles
import styles from './CreateAdminRoomContainer.module.scss';

// types
import {AdminDialogsEnum, NotificationType} from "../../store/types";

// utils
enum TabsValues {
    Background = 1,
    Settings = 2,
    Attendees = 3,
    Sound = 4,
    Links = 5,
    Monetization = 6,
    Preview = 7,
}

enum TabsLabels {
    Background = 'Background',
    Settings = 'Settings',
    Attendees = 'Attendees',
    Sound = 'Sound',
    Links = 'Links',
    Monetization = 'Monetization',
    Preview = 'Preview',
}

type ValuesSwitcherAlias = ValuesSwitcherItem<TabsValues, TabsLabels>;

const tabs: ValuesSwitcherAlias[] = [
    {
        id: 1,
        value: TabsValues.Background,
        label: TabsLabels.Background,
    },
    {
        id: 2,
        value: TabsValues.Settings,
        label: TabsLabels.Settings,
    },
    {
        id: 3,
        value: TabsValues.Attendees,
        label: TabsLabels.Attendees,
    },
    {
        id: 4,
        value: TabsValues.Sound,
        label: TabsLabels.Sound,
    },
    {
        id: 5,
        value: TabsValues.Links,
        label: TabsLabels.Links,
    },
    {
        id: 6,
        value: TabsValues.Monetization,
        label: TabsLabels.Monetization,
    },
    {
        id: 7,
        value: TabsValues.Preview,
        label: TabsLabels.Preview,
    },
];

const defaultValues = {
    background: '',
    description: '',
    tags: [],
    participantsNumber: 1,
    participantsPositions: [{ left: 50, top: 50, id: '1' }],
};

const validationSchema = yup.object({
    background: simpleStringSchema(),
    description: simpleStringSchemaWithLength(MAX_DESCRIPTION_LENGTH).required('required'),
    tags: tagsSchema(),
    participantsNumber: participantsNumberSchema().required('required'),
    participantsPositions: participantsPositionsSchema(),
});

const Component = () => {
    const router = useRouter();

    const { state: commonTemplate } = useStore($commonTemplateStore);
    const { state: categories } = useStore($businessCategoriesStore);

    const isFileUploading = useStore(uploadTemplateFileFx.pending);

    const resolver = useYupValidationResolver(validationSchema, {
        reduceArrayErrors: true,
    });

    const methods = useForm({
        defaultValues,
        resolver,
        mode: 'onBlur',
    });

    const { control, handleSubmit, setValue, trigger } = methods;

    const background = useWatch({ control, name: 'background' });

    const { activeValue, activeItem, onValueChange, onNextValue, onPreviousValue } =
        useValueSwitcher<TabsValues, TabsLabels>({
            values: tabs,
            initialValue: tabs[0].value,
        });

    useEffect(() => {
        getCommonTemplateFx({
            templateId: router.query.roomId as string,
        })
        getBusinessCategoriesFx({});

        initWindowListeners();

        return () => {
            removeWindowListeners();
        };
    }, [router.isReady]);

    const handleValueChange = useCallback(
        async (item: ValuesSwitcherAlias) => {
            if (item.value > TabsValues.Background && !(commonTemplate?.draftUrl || background)) {
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
        [onValueChange, background, commonTemplate?.draftUrl],
    );

    const onSubmit = useCallback(handleSubmit((data) => {
        console.log(data);
    }), []);

    const handleFileUploaded = useCallback(async (file: File) => {
        setValue('background', URL.createObjectURL(file));

        if (commonTemplate?.id) {
            uploadTemplateFileFx({
                file,
                templateId: commonTemplate.id,
            });
        }
    }, [commonTemplate?.id]);

    const handleOpenCancelConfirmationDialog = useCallback(() => {
        openAdminDialogEvent(AdminDialogsEnum.cancelCreateRoomDialog);
    }, []);

    return (
        <CustomGrid container className={styles.wrapper}>
            <FormProvider {...methods}>
                <form onSubmit={onSubmit}>
                    <TemplateBackground url={commonTemplate?.draftUrl || background} />
                    <CustomPaper
                        variant="black-glass"
                        className={styles.navigationPaper}
                    >
                        <ValuesSwitcher<TabsValues, TabsLabels>
                            values={tabs}
                            activeValue={activeItem}
                            onValueChanged={handleValueChange}
                            variant="transparent"
                            itemClassName={styles.switchItem}
                        />
                    </CustomPaper>
                    <CustomGrid className={styles.componentsWrapper}>
                            <Fade
                                key={TabsLabels.Background}
                                in={activeItem.label === TabsLabels.Background} unmountOnExit
                            >
                                <CustomGrid className={styles.componentItem}>
                                    <UploadBackground
                                        isUploadDisabled={isFileUploading}
                                        isFileExists={Boolean(commonTemplate?.draftUrl || background)}
                                        onNextStep={onNextValue}
                                        onFileUploaded={handleFileUploaded}
                                    />
                                </CustomGrid>
                            </Fade>

                            <Fade
                                key={TabsLabels.Settings}
                                in={activeItem.label === TabsLabels.Settings} unmountOnExit
                            >
                                <CustomGrid className={styles.componentItem}>
                                    <CommonTemplateSettings
                                        categories={categories.list}
                                        onNextStep={onNextValue}
                                        onPreviousStep={onPreviousValue}
                                    />
                                </CustomGrid>
                            </Fade>

                            <Fade
                                key={TabsLabels.Attendees}
                                in={activeItem.label === TabsLabels.Attendees} unmountOnExit
                            >
                                <CustomGrid className={styles.componentItem}>
                                    <AttendeesPositions
                                        onNextStep={onNextValue}
                                        onPreviousStep={onPreviousValue}
                                    />
                                </CustomGrid>
                            </Fade>
                    </CustomGrid>
                    <CustomTooltip
                        title={
                            <Translation
                                nameSpace="rooms"
                                translation="tooltips.cancel"
                            />
                        }
                    >
                        <ActionButton
                            onAction={handleOpenCancelConfirmationDialog}
                            Icon={
                                <CloseIcon
                                    width="40px"
                                    height="40px"
                                />
                            }
                            className={styles.closeButton}
                            variant="gray"
                        />
                    </CustomTooltip>
                </form>
            </FormProvider>
        </CustomGrid>
    );
};

export const CreateAdminRoomContainer = memo(Component);
