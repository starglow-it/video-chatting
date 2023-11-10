import { memo, useCallback } from 'react';
import { useStore, useStoreMap } from 'effector-react';
import clsx from 'clsx';
import Router from 'next/router';

// components
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomDialog } from 'shared-frontend/library/custom/CustomDialog';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { TagItem } from 'shared-frontend/library/common/TagItem';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { BusinessCategoryTagsClip } from 'shared-frontend/library/common/BusinessCategoryTagsClip';
import { ButtonsGroup } from '@components/ButtonsGroup/ButtonsGroup';
import { Translation } from '@components/Translation/Translation';

// icons
import { EditIcon } from 'shared-frontend/icons/OtherIcons/EditIcon';
import { PaymentIcon } from 'shared-frontend/icons/OtherIcons/PaymentIcon';
import { PeopleIcon } from 'shared-frontend/icons/OtherIcons/PeopleIcon';

import {
    $activeTemplateIdStore,
    $commonTemplates,
    $roomPreviewDialogStore,
    closeAdminDialogEvent,
    setActiveTemplateIdEvent,
} from '../../../store';

import styles from './RoomPreviewDialog.module.scss';
import { AdminDialogsEnum } from '../../../store/types';

const RoomPreviewDialog = memo(() => {
    const activeTemplateId = useStore($activeTemplateIdStore);

    const previewTemplate = useStoreMap({
        store: $commonTemplates,
        keys: [activeTemplateId],
        fn: (state, [templateId]) =>
            state.state.list.find(template => template.id === templateId),
    });

    const roomPreviewDialog = useStore($roomPreviewDialogStore);

    const handleClose = useCallback(() => {
        setActiveTemplateIdEvent(null);
        closeAdminDialogEvent(AdminDialogsEnum.roomPreviewDialog);
    }, []);

    const previewImage = previewTemplate?.previewUrls?.find(
        preview => preview.resolution === 1080,
    );

    const priceInCents = previewTemplate?.priceInCents;

    const handleEditRoom = useCallback(() => {
        setActiveTemplateIdEvent(null);
        closeAdminDialogEvent(AdminDialogsEnum.roomPreviewDialog);
        Router.push(`/rooms/edit/${previewTemplate?.id}`);
    }, [previewTemplate?.id]);

    return (
        <CustomDialog
            open={roomPreviewDialog}
            onClose={handleClose}
            contentClassName={styles.dialogContent}
            maxWidth="lg"
            withCloseButton={false}
            withNativeCloseBehavior
        >
            <CustomGrid container wrap="nowrap">
                <CustomGrid className={styles.templatePreview}>
                    <TagItem
                        label={
                            !previewTemplate?.isPublic ? 'Pending' : 'Published'
                        }
                        color={
                            !previewTemplate?.isPublic ? '#BDC8D3' : '#30BE39'
                        }
                        className={styles.roomStatusLabel}
                    />
                    <ConditionalRender condition={Boolean(previewImage?.id)}>
                        <CustomImage
                            src={previewImage?.url || ''}
                            layout="fill"
                            objectFit="cover"
                            objectPosition="center"
                            alt="room-preview-dialog"
                        />
                    </ConditionalRender>
                </CustomGrid>
                <CustomBox className={styles.templateInfoContent}>
                    <CustomGrid
                        container
                        wrap="nowrap"
                        justifyContent="space-between"
                        className={styles.templateInfo}
                        gap={2}
                    >
                        {previewTemplate?.businessCategories ? (
                            <BusinessCategoryTagsClip
                                lines={1}
                                maxWidth={210}
                                tags={previewTemplate?.businessCategories}
                            />
                        ) : null}
                        <CustomGrid
                            container
                            className={styles.templateType}
                            justifyContent="flex-end"
                            gap={1}
                            wrap="nowrap"
                        >
                            <TagItem
                                startIcon={
                                    <PaymentIcon width="22px" height="22px" />
                                }
                                className={clsx(styles.templatePayment, {
                                    [styles.paid]: Boolean(priceInCents),
                                })}
                                label={
                                    <CustomTypography
                                        variant="body2"
                                        color={
                                            priceInCents
                                                ? 'colors.blue.primary'
                                                : 'colors.green.primary'
                                        }
                                    >
                                        {priceInCents
                                            ? priceInCents / 100
                                            : previewTemplate?.type}
                                    </CustomTypography>
                                }
                            />
                            <TagItem
                                startIcon={
                                    <PeopleIcon width="22px" height="22px" />
                                }
                                className={styles.templateParticipant}
                                label={
                                    <CustomTypography
                                        variant="body2"
                                        color="colors.black.primary"
                                    >
                                        {previewTemplate?.maxParticipants || 0}
                                    </CustomTypography>
                                }
                            />
                        </CustomGrid>
                    </CustomGrid>
                    <CustomTypography className={styles.name} variant="h2bold">
                        {previewTemplate?.name || ''}
                    </CustomTypography>
                    <CustomTypography className={styles.description}>
                        {previewTemplate?.description || ''}
                    </CustomTypography>

                    <ButtonsGroup className={styles.buttons}>
                        <CustomButton
                            onClick={handleEditRoom}
                            className={styles.chooseBtn}
                            Icon={<EditIcon width="28px" height="28px" />}
                            label={
                                <Translation
                                    nameSpace="rooms"
                                    translation="buttons.edit"
                                />
                            }
                        />
                    </ButtonsGroup>
                </CustomBox>
            </CustomGrid>
        </CustomDialog>
    );
});

RoomPreviewDialog.displayName = 'RoomPreviewDialog';

export { RoomPreviewDialog };
