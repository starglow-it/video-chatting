import { memo, useCallback, useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { useStore } from 'effector-react';
import Router, { useRouter } from 'next/router';

// shared
import {
    participantsPositionsSchema,
    simpleNumberSchema,
    simpleStringSchema,
    simpleStringSchemaWithLength,
    tagsSchema,
    templatePriceSchema,
    templatesLinksSchema,
} from 'shared-frontend/validation';
import { adjustUserPositions, getRandomNumber } from 'shared-utils';
import {
    MAX_DESCRIPTION_LENGTH,
    MAX_NAME_LENGTH,
    PARTICIPANT_POSITIONS,
} from 'shared-const';

import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { ValuesSwitcher } from 'shared-frontend/library/common/ValuesSwitcher';
import { CustomFade } from 'shared-frontend/library/custom/CustomFade';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CloseIcon } from 'shared-frontend/icons/OtherIcons/CloseIcon';
import { ImagePlaceholderIcon } from 'shared-frontend/icons/OtherIcons/ImagePlaceholderIcon';

import { useYupValidationResolver } from 'shared-frontend/hooks/useYupValidationResolver';
import { useValueSwitcher } from 'shared-frontend/hooks/useValuesSwitcher';

// components
import { TemplateBackground } from '@components/CreateRoom/TemplateBackground/TemplateBackground';
import { Translation } from '@components/Translation/Translation';
import { UploadBackground } from '@components/CreateRoom/UploadBackground/UploadBackground';
import { CommonTemplateSettings } from '@components/CreateRoom/CommonTemplateSettings/CommonTemplateSettings';
import { TemplateLinks } from '@components/CreateRoom/TemplateLinks/TemplateLinks';
import { TemplatePrice } from '@components/CreateRoom/TemplatePrice/TemplatePrice';
import { CancelCreateRoomDialog } from '@components/Dialogs/CancelCreateRoomDialog/CancelCreateRoomDialog';
import { ConfirmCreateRoomDialog } from '@components/Dialogs/ConfirmCreateRoomDialog/ConfirmCreateRoomDialog';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';

// stores
import { ValuesSwitcherItem } from 'shared-frontend/types';
import { PriceValues, RoomType } from 'shared-types';
import { getProtocol } from 'src/helpers/http/getProtocol';
import { mapToThumbYoutubeUrl } from 'src/helpers/func/mapToThumbYoutubeUrl';
import {
    $businessCategoriesStore,
    $commonTemplateStore,
    addNotificationEvent,
    initWindowListeners,
    removeWindowListeners,
    openAdminDialogEvent,
    updateCommonTemplateDataEvent,
    updateCommonTemplateFx,
    getCommonTemplateEvent,
    getBusinessCategoriesEvent,
    resetCommonTemplateStore,
    uploadTemplateBackgroundFx,
} from '../../store';

// styles
import styles from './CreateAdminRoomContainer.module.scss';

// types
import { AdminDialogsEnum, NotificationType } from '../../store/types';
import frontendConfig from '../../const/config';

// utils
enum TabsValues {
    Background = 1,
    Settings = 2,
    Attendees = 3,
    Links = 5,
    Monetization = 6,
    Preview = 7,
}

enum TabsLabels {
    Background = 'Background',
    Settings = 'Settings',
    Attendees = 'Attendees',
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
        value: TabsValues.Links,
        label: TabsLabels.Links,
    },
    {
        id: 4,
        value: TabsValues.Monetization,
        label: TabsLabels.Monetization,
    },
];

const defaultValues = {
    background: '',
    name: '',
    description: '',
    youtubeUrl: '',
    participantsNumber: 10,
    participantsPositions: PARTICIPANT_POSITIONS.map(item => ({
        ...item,
        id: getRandomNumber(10000).toString(),
    })),
    templateLinks: [],
    tags: [],
    type: 'free',
    templatePrice: undefined,
    draft: true,
    subdomain: undefined,
};

const validationSchema = {
    background: simpleStringSchema(),
    name: simpleStringSchemaWithLength(MAX_NAME_LENGTH).required('required'),
    description: simpleStringSchemaWithLength(MAX_DESCRIPTION_LENGTH),
    tags: tagsSchema(),
    participantsPositions: participantsPositionsSchema(),
    templateLinks: templatesLinksSchema(),
    type: simpleStringSchema(),
    templatePrice: simpleNumberSchema().when('type', {
        is: (value: string) => value === 'paid',
        then: templatePriceSchema(0.99, 999999),
        otherwise: simpleNumberSchema()
            .notRequired()
            .nullable(true)
            .transform(value => (Number.isNaN(value) ? undefined : value)),
    }),
    draft: yup.bool(),
};

const Component = () => {
    const router = useRouter();
    const [roomId, withSubdomain] = router.query.room as any;

    const { state: commonTemplate } = useStore($commonTemplateStore);

    const { state: categories } = useStore($businessCategoriesStore);

    const isFileUploading = useStore(uploadTemplateBackgroundFx.pending);

    const { activeItem, onValueChange, onNextValue, onPreviousValue } =
        useValueSwitcher<TabsValues, TabsLabels>({
            values: tabs,
            initialValue: tabs[0].value,
        });

    const resolver = useYupValidationResolver(
        yup.object({
            ...validationSchema,
            subdomain: withSubdomain
                ? yup.string().required()
                : yup.string().notRequired().nullable(true),
        }),
        {
            reduceArrayErrors: true,
        },
    );
    const methods = useForm({
        criteriaMode: 'all',
        defaultValues,
        resolver,
    });

    const { control, handleSubmit, setValue, trigger } = methods;

    const background = useWatch({
        control,
        name: 'background',
    });

    const templateName = useWatch({
        control,
        name: 'name',
    });

    const type = useWatch({
        control,
        name: 'type',
    });

    const templateLinks = useWatch({
        control,
        name: 'templateLinks',
    });

    const templatePrice = useWatch({
        control,
        name: 'templatePrice',
    });

    const youtubeUrl = useWatch({ control, name: 'youtubeUrl' });

    useEffect(() => {
        getCommonTemplateEvent({
            templateId: roomId as string,
        });
        getBusinessCategoriesEvent({});

        initWindowListeners();

        return () => {
            removeWindowListeners();
            resetCommonTemplateStore();
        };
    }, [router.isReady]);

    const handleValueChange = useCallback(
        async (item: ValuesSwitcherAlias) => {
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
                }
                if (!(commonTemplate?.draftUrl || background)) {
                    addNotificationEvent({
                        type: NotificationType.BackgroundFileShouldBeUploaded,
                        message: 'uploadBackground.shouldBeUploaded',
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
        [activeItem, background, commonTemplate?.draftUrl, youtubeUrl],
    );

    const onSubmit = useCallback(
        handleSubmit(async data => {
            if (commonTemplate?.id) {
                const { error } = await updateCommonTemplateFx({
                    templateId: commonTemplate.id,
                    data: {
                        name: data.name,
                        description: data.description,
                        maxParticipants: data.participantsNumber,
                        businessCategories: data.tags,
                        priceInCents:
                            data.type === 'paid' ? data.templatePrice * 100 : 0,
                        type: data.type,
                        url: commonTemplate?.draftUrl,
                        usersPosition: adjustUserPositions(
                            data.participantsPositions,
                        ),
                        links: data.templateLinks.map((link: any) => ({
                            item: link.value,
                            title: link.title,
                            position: {
                                top: link.top,
                                left: link.left,
                            },
                        })),
                        isPublic: !data.draft,
                        draft: false,
                        previewUrls: commonTemplate?.draftPreviewUrls?.map(
                            ({ id }) => id,
                        ) as any,
                        draftPreviewUrls: [],
                        draftUrl: '',
                        subdomain: !!withSubdomain
                            ? `${getProtocol()}//${data.subdomain}.${
                                  frontendConfig.baseDomain
                              }`
                            : '',
                        mediaLink: (data.youtubeUrl
                            ? {
                                  src: data.youtubeUrl,
                                  thumb: mapToThumbYoutubeUrl(data.youtubeUrl),
                                  platform: 'youtube',
                              }
                            : null) as any,
                    },
                });
                if (error) {
                    addNotificationEvent({
                        type: NotificationType.validationError,
                        message: error.message ?? '',
                        withErrorIcon: true,
                    });
                    return;
                }
                if (commonTemplate.roomType === RoomType.Normal) {
                    if (withSubdomain) {
                        Router.push('/subdomain');
                    } else {
                        Router.push('/rooms');
                    }
                } else {
                    Router.push('/featured-background');
                }

                addNotificationEvent({
                    type: NotificationType.roomPublished,
                    message: data.draft
                        ? 'templates.created'
                        : 'templates.createdAndPublished',
                    messageOptions: {
                        templateName: data.name,
                    },
                });
            }
        }),
        [
            commonTemplate?.id,
            commonTemplate?.draftUrl,
            commonTemplate?.draftPreviewUrls,
        ],
    );

    const handleFileUploaded = useCallback(
        async (file: File) => {
            updateCommonTemplateDataEvent({
                draftUrl: '',
                draftPreviewUrls: [],
                // templateType: file.type.split('/')[0],
            });

            setValue('background', URL.createObjectURL(file), {
                shouldDirty: true,
            });
            setValue('youtubeUrl', '');

            if (commonTemplate?.id) {
                const response = await uploadTemplateBackgroundFx({
                    file,
                    templateId: commonTemplate.id,
                });

                setValue('background', response.state?.draftUrl);
            }
        },
        [commonTemplate?.id],
    );

    const handleCreateRoom = useCallback(() => {
        setValue('draft', true);
        onSubmit();
    }, [onSubmit]);

    const handleCreateAndPublishRoom = useCallback(() => {
        setValue('draft', false);
        onSubmit();
    }, [onSubmit]);

    const handleOpenConfirmDialog = useCallback(() => {
        openAdminDialogEvent(
            AdminDialogsEnum.confirmCreateAndPublishRoomDialog,
        );
    }, []);

    const handleOpenCancelConfirmationDialog = useCallback(() => {
        openAdminDialogEvent(AdminDialogsEnum.cancelCreateRoomDialog);
    }, []);

    const renderButtons = () => {
        if (commonTemplate?.roomType === RoomType.Featured)
            return (
                <CustomButton
                    className={styles.createAndPublishButton}
                    onClick={handleCreateAndPublishRoom}
                    disabled={isFileUploading}
                    label={
                        <Translation
                            nameSpace="rooms"
                            translation="buttons.create"
                        />
                    }
                />
            );
        return (
            <>
                <CustomButton
                    className={styles.createButton}
                    disabled={isFileUploading}
                    onClick={handleCreateRoom}
                    label={
                        <Translation
                            nameSpace="rooms"
                            translation="buttons.create"
                        />
                    }
                />
                <CustomButton
                    className={styles.createAndPublishButton}
                    onClick={handleOpenConfirmDialog}
                    disabled={isFileUploading}
                    label={
                        <Translation
                            nameSpace="rooms"
                            translation="buttons.createAndPublish"
                        />
                    }
                />
            </>
        );
    };

    return (
        <CustomGrid container className={styles.wrapper}>
            <FormProvider {...methods}>
                <form className={styles.form} onSubmit={onSubmit}>
                    <TemplateBackground
                        templateType={commonTemplate?.templateType ?? 'video'}
                        url={commonTemplate?.draftUrl || background}
                        youtubeUrl={youtubeUrl}
                    />

                    <CustomGrid
                        container
                        wrap="nowrap"
                        justifyContent="flex-end"
                        gap={1.5}
                        className={styles.navigationPaper}
                    >
                        <CustomGrid
                            container
                            gap={1.5}
                            className={styles.infoWrapper}
                        >
                            <CustomGrid
                                item
                                container
                                flexShrink={0}
                                alignItems="center"
                                justifyContent="center"
                                className={styles.imagePlaceholder}
                            >
                                <ImagePlaceholderIcon
                                    width="34px"
                                    height="34px"
                                />
                            </CustomGrid>

                            <CustomPaper
                                variant="black-glass"
                                className={styles.mainInfo}
                            >
                                <CustomGrid container direction="column">
                                    {templateName ? (
                                        <CustomTypography
                                            color="colors.white.primary"
                                            className={styles.name}
                                        >
                                            {templateName}
                                        </CustomTypography>
                                    ) : (
                                        <CustomTypography color="colors.white.primary">
                                            <Translation
                                                nameSpace="rooms"
                                                translation="preview.roomName"
                                            />
                                        </CustomTypography>
                                    )}
                                    {type ? (
                                        <CustomTypography
                                            variant="body2"
                                            color={
                                                type === PriceValues.Paid
                                                    ? 'colors.blue.primary'
                                                    : 'colors.green.primary'
                                            }
                                            className={styles.type}
                                        >
                                            {type === PriceValues.Paid
                                                ? `${templatePrice ?? 0}$`
                                                : type}
                                        </CustomTypography>
                                    ) : null}
                                </CustomGrid>
                            </CustomPaper>
                        </CustomGrid>

                        <CustomPaper
                            variant="black-glass"
                            className={styles.paper}
                        >
                            <ValuesSwitcher<TabsValues, TabsLabels>
                                values={tabs}
                                activeValue={activeItem}
                                onValueChanged={handleValueChange}
                                variant="transparent"
                                itemClassName={styles.switchItem}
                                className={styles.switcherWrapper}
                            />
                        </CustomPaper>

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
                                Icon={<CloseIcon width="40px" height="40px" />}
                                className={styles.closeButton}
                                variant="gray"
                            />
                        </CustomTooltip>
                    </CustomGrid>

                    <CustomGrid className={styles.componentsWrapper}>
                        <CustomFade
                            key={TabsLabels.Background}
                            open={activeItem.label === TabsLabels.Background}
                            unmountOnExit
                            className={styles.componentItem}
                        >
                            <UploadBackground
                                isFileUploading={isFileUploading}
                                isFileExists={Boolean(
                                    commonTemplate?.draftUrl || background,
                                )}
                                onNextStep={onNextValue}
                                onFileUploaded={handleFileUploaded}
                            />
                        </CustomFade>

                        <CustomFade
                            key={TabsLabels.Settings}
                            open={activeItem.label === TabsLabels.Settings}
                            unmountOnExit
                            className={styles.componentItem}
                        >
                            <CommonTemplateSettings
                                categories={categories.list}
                                onNextStep={onNextValue}
                                onPreviousStep={onPreviousValue}
                                isSubdomain={Boolean(withSubdomain)}
                            />
                        </CustomFade>

                        <CustomFade
                            key={TabsLabels.Links}
                            open={activeItem.label === TabsLabels.Links}
                            unmountOnExit
                            className={styles.componentItem}
                        >
                            <TemplateLinks
                                links={templateLinks}
                                onNextStep={onNextValue}
                                onPreviousStep={onPreviousValue}
                            />
                        </CustomFade>

                        <CustomFade
                            key={TabsLabels.Monetization}
                            open={activeItem.label === TabsLabels.Monetization}
                            unmountOnExit
                            className={styles.componentItem}
                        >
                            <TemplatePrice
                                onNextStep={onNextValue}
                                onPreviousStep={onPreviousValue}
                                submitButtons={renderButtons()}
                            />
                        </CustomFade>
                    </CustomGrid>
                </form>
            </FormProvider>
            <CancelCreateRoomDialog />
            <ConfirmCreateRoomDialog onCreate={handleCreateAndPublishRoom} />
        </CustomGrid>
    );
};

export const CreateAdminRoomContainer = memo(Component);
