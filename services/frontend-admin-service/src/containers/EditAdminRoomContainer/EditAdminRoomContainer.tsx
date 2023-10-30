import { memo, useCallback, useEffect, useRef } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { useStore } from 'effector-react';
import Router, { useRouter } from 'next/router';

// shared
import {
    participantsNumberSchema,
    participantsPositionsSchema,
    simpleNumberSchema,
    simpleStringSchema,
    simpleStringSchemaWithLength,
    tagsSchema,
    templatePriceSchema,
    templatesLinksSchema,
} from 'shared-frontend/validation';
import { adjustUserPositions, getRandomNumber } from 'shared-utils';
import { MAX_DESCRIPTION_LENGTH, MAX_NAME_LENGTH } from 'shared-const';

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
import { usePrevious } from 'shared-frontend/hooks/usePrevious';

// components
import { TemplateBackground } from '@components/CreateRoom/TemplateBackground/TemplateBackground';
import { Translation } from '@components/Translation/Translation';
import { UploadBackground } from '@components/CreateRoom/UploadBackground/UploadBackground';
import { CommonTemplateSettings } from '@components/CreateRoom/CommonTemplateSettings/CommonTemplateSettings';
import { AttendeesPositions } from '@components/CreateRoom/AttendeesPositions/AttendeesPositions';
import { TemplateLinks } from '@components/CreateRoom/TemplateLinks/TemplateLinks';
import { TemplatePrice } from '@components/CreateRoom/TemplatePrice/TemplatePrice';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { ConfirmSaveChangesDialog } from '@components/Dialogs/ConfirmSaveChangesDialog/ConfirmSaveChangesDialog';
import { CancelEditRoomDialog } from '@components/Dialogs/CancelEditRoomDialog/CancelEditRoomDialog';

// stores
import { ValuesSwitcherItem } from 'shared-frontend/types';
import { ICommonTemplate, PriceValues, RoomType } from 'shared-types';
import { getProtocol } from 'src/helpers/http/getProtocol';
import {
    $businessCategoriesStore,
    $commonTemplateStore,
    addNotificationEvent,
    getCommonTemplateEvent,
    initWindowListeners,
    openAdminDialogEvent,
    removeWindowListeners,
    updateCommonTemplateDataEvent,
    updateCommonTemplateFx,
    getBusinessCategoriesEvent,
    resetCommonTemplateStore,
    uploadTemplateBackgroundFx,
} from '../../store';

// styles
import styles from './EditAdminRoomContainer.module.scss';
import frontendConfig from '../../const/config';

// types
import { AdminDialogsEnum, NotificationType } from '../../store/types';

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
    subdomain: undefined,
    tags: [],
    participantsNumber: 2,
    participantsPositions: [],
    templateLinks: [],
    type: 'free',
    templatePrice: undefined,
    draft: true,
};

const validationSchema = {
    background: simpleStringSchema(),
    name: simpleStringSchemaWithLength(MAX_NAME_LENGTH).required('required'),
    description: simpleStringSchemaWithLength(MAX_DESCRIPTION_LENGTH),
    tags: tagsSchema(),
    participantsNumber: participantsNumberSchema().required('required'),
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
    subdomain: yup.string().required(),
};

const Component = () => {
    const router = useRouter();
    const [roomId, withSubdomain] = router.query.room as any;

    const { state: commonTemplate } = useStore($commonTemplateStore);

    const { state: categories } = useStore($businessCategoriesStore);

    const isFileUploading = useStore(uploadTemplateBackgroundFx.pending);

    const templateTypeRef = useRef('');

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

    const {
        reset,
        control,
        handleSubmit,
        setValue,
        trigger,
        formState: { dirtyFields },
    } = methods;

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

    const participantsNumber = useWatch({
        control,
        name: 'participantsNumber',
    });

    const participantsPositions = useWatch({
        control,
        name: 'participantsPositions',
    });

    const templatePrice = useWatch({
        control,
        name: 'templatePrice',
    });

    const previousParticipantsNumber = usePrevious(participantsNumber);

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

    useEffect(() => {
        if (commonTemplate) {
            const userPositions = commonTemplate.usersPosition?.length
                ? commonTemplate.usersPosition.map(({ bottom, left }) => ({
                      top: 1 - bottom,
                      left,
                      id: getRandomNumber(10000).toString(),
                  }))
                : defaultValues.participantsPositions;

            const matches = commonTemplate.subdomain?.match(
                '^http[s]?://([^/?#]+)(?:[/?#]|$)',
            );
            const domain = matches && matches[1];

            reset({
                name: commonTemplate.name,
                description: commonTemplate.description || '',
                type: commonTemplate.type,
                background: commonTemplate.url,
                templateLinks: commonTemplate?.links?.map(
                    ({ item, position }) => ({
                        value: item,
                        top: position.top,
                        left: position.left,
                    }),
                ),
                templatePrice: commonTemplate.priceInCents
                    ? commonTemplate.priceInCents / 100
                    : undefined,
                participantsNumber: commonTemplate.maxParticipants,
                participantsPositions: userPositions,
                tags: commonTemplate?.businessCategories?.map(item => ({
                    ...item,
                    label: item.value,
                })),
                subdomain: domain?.split('.')[0],
            });

            updateCommonTemplateDataEvent({
                draftUrl: commonTemplate.url,
            });

            templateTypeRef.current = commonTemplate.templateType;
        }
    }, [commonTemplate?.id]);

    useEffect(() => {
        if (
            !previousParticipantsNumber ||
            participantsNumber === previousParticipantsNumber
        )
            return;

        if (previousParticipantsNumber > participantsNumber) {
            setValue(
                'participantsPositions',
                participantsPositions.slice(0, participantsNumber),
            );
            return;
        }

        const createdPositions = new Array(
            participantsNumber - (participantsPositions?.length || 0),
        )
            .fill(null)
            .map(() => ({
                id: getRandomNumber(10000),
                left: 0.5,
                top: 0.5,
            }));

        const newPositions = [...participantsPositions, ...createdPositions];

        setValue('participantsPositions', newPositions);
    }, [participantsNumber, previousParticipantsNumber, participantsPositions]);

    const handleValueChange = useCallback(
        async (item: ValuesSwitcherAlias) => {
            if (
                item.value > TabsValues.Background &&
                !(commonTemplate?.draftUrl || background)
            ) {
                addNotificationEvent({
                    type: NotificationType.BackgroundFileShouldBeUploaded,
                    message: 'uploadBackground.shouldBeUploaded',
                    withErrorIcon: true,
                });
                return;
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
                    onValueChange(tabs[3]);
                    return;
                }
            }

            onValueChange(item);
        },
        [activeItem, background, commonTemplate?.draftUrl],
    );

    const onSubmit = useCallback(
        handleSubmit(async data => {
            if (commonTemplate?.id) {
                const templatePriceFinal =
                    data.type === 'paid' ? data.templatePrice * 100 : 0;

                const updateData = {
                    name: data.name,
                    description: data.description,
                    maxParticipants: data.participantsNumber,
                    businessCategories: data.tags,
                    type: data.type,
                    priceInCents: templatePriceFinal,
                    usersPosition: adjustUserPositions(
                        data.participantsPositions,
                    ),
                    links: data.templateLinks.map((link: any) => ({
                        item: link.value,
                        position: {
                            top: link.top,
                            left: link.left,
                        },
                    })),
                    isAudioAvailable: true,
                    subdomain: withSubdomain
                        ? `${getProtocol()}//${data.subdomain}.${
                              frontendConfig.baseDomain
                          }`
                        : '',
                    mediaLink: commonTemplate?.draftUrl
                        ? null
                        : (undefined as any),
                } as any;

                if (dirtyFields.background) {
                    updateData.draftUrl = '';
                    updateData.draftPreviewUrls = [];
                    updateData.url = commonTemplate?.draftUrl;
                    updateData.previewUrls =
                        commonTemplate?.draftPreviewUrls?.map(({ id }) => id);
                }

                await updateCommonTemplateFx({
                    templateId: commonTemplate.id,
                    data: updateData,
                });

                if (commonTemplate.roomType === RoomType.Normal) {
                    if (withSubdomain) {
                        await Router.push('/subdomain');
                    } else {
                        await Router.push('/rooms');
                    }
                } else {
                    await Router.push('/featured-background');
                }

                addNotificationEvent({
                    type: NotificationType.roomChangesSaved,
                    message: 'templates.roomChangesSaved',
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
            dirtyFields,
        ],
    );

    const handleFileUploaded = useCallback(
        async (file: File) => {
            updateCommonTemplateDataEvent({
                draftUrl: '',
                draftPreviewUrls: [],
                templateType: file.type.split('/')[0],
            } as any);

            setValue('background', URL.createObjectURL(file), {
                shouldDirty: true,
            });

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

    const handleOpenCancelEditDialog = useCallback(() => {
        openAdminDialogEvent(AdminDialogsEnum.cancelEditRoomDialog);
    }, []);

    const handleConfirmCancelEditRoom = useCallback(() => {
        updateCommonTemplateFx({
            templateId: commonTemplate?.id,
            data: {
                draftUrl: '',
                draftPreviewUrls: [],
                templateType:
                    templateTypeRef.current as ICommonTemplate['templateType'],
            },
        });

        if (commonTemplate?.roomType === RoomType.Normal) {
            if (withSubdomain) {
                router.push('/subdomain');
            } else {
                router.push('/rooms');
            }
        } else {
            router.push('/featured-background');
        }
    }, [commonTemplate?.id]);

    const handleConfirmSaveChanges = useCallback(() => {
        onSubmit();
    }, [onSubmit]);

    const handleSaveChanges = useCallback(() => {
        openAdminDialogEvent(AdminDialogsEnum.saveRoomChangesDialog);
    }, []);

    return (
        <CustomGrid container className={styles.wrapper}>
            <FormProvider {...methods}>
                <form className={styles.form} onSubmit={onSubmit}>
                    <TemplateBackground
                        templateType={commonTemplate?.templateType ?? 'video'}
                        url={commonTemplate?.draftUrl || background}
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
                                onAction={handleOpenCancelEditDialog}
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
                            key={TabsLabels.Attendees}
                            open={activeItem.label === TabsLabels.Attendees}
                            unmountOnExit
                            className={styles.componentItem}
                        >
                            <AttendeesPositions
                                onNextStep={onNextValue}
                                onPreviousStep={onPreviousValue}
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
                                submitButtons={
                                    <CustomButton
                                        className={styles.createButton}
                                        onClick={handleSaveChanges}
                                        disabled={isFileUploading}
                                        label={
                                            <Translation
                                                nameSpace="rooms"
                                                translation="buttons.saveChanges"
                                            />
                                        }
                                    />
                                }
                            />
                        </CustomFade>
                    </CustomGrid>
                </form>
            </FormProvider>
            <CancelEditRoomDialog onConfirm={handleConfirmCancelEditRoom} />
            <ConfirmSaveChangesDialog onConfirm={handleConfirmSaveChanges} />
        </CustomGrid>
    );
};

export const EditAdminRoomContainer = memo(Component);
