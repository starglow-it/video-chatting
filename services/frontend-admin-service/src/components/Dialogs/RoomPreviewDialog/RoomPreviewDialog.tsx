import React, {memo, useCallback} from "react";
import {useStore, useStoreMap} from "effector-react";
import clsx from "clsx";

import {CustomGrid} from "shared-frontend/library/custom/CustomGrid";
import {CustomImage} from "shared-frontend/library/custom/CustomImage";
import {CustomDialog} from "shared-frontend/library/custom/CustomDialog";
import {CustomBox} from "shared-frontend/library/custom/CustomBox";
import {CustomButton} from "shared-frontend/library/custom/CustomButton";
import {ConditionalRender} from "shared-frontend/library/common/ConditionalRender";
import { TagItem } from "shared-frontend/library/common/TagItem";
import {CustomTypography} from "shared-frontend/library/custom/CustomTypography";

import {EditIcon} from "shared-frontend/icons/OtherIcons/EditIcon";
import {StatisticsIcon} from "shared-frontend/icons/OtherIcons/StatisticsIcon";
import {PaymentIcon} from "shared-frontend/icons/OtherIcons/PaymentIcon";

import {ButtonsGroup} from "@components/ButtonsGroup/ButtonsGroup";
import {Translation} from "@components/Translation/Translation";

import {
    $commonTemplates,
    $roomPreviewDialogStore,
    $roomPreviewIdStore,
    setRoomPreviewIdEvent
} from "../../../store";

import styles from './RoomPreviewDialog.module.scss';

export const RoomPreviewDialog = memo(() => {
    const roomPreviewId = useStore($roomPreviewIdStore);

    const previewTemplate = useStoreMap({
        store: $commonTemplates,
        keys: [roomPreviewId],
        fn: (state, [templateId]) => state.state.list.find(template => template.id === templateId),
    });

    const roomPreviewDialog = useStore($roomPreviewDialogStore);

    const handleClose = useCallback(() => {
        setRoomPreviewIdEvent(null);
    }, []);

    const previewImage = previewTemplate?.previewUrls?.find(preview => preview.resolution === 1080);

    const priceInCents = previewTemplate?.priceInCents;

    return (
        <CustomDialog
            open={roomPreviewDialog}
            onClose={handleClose}
            contentClassName={styles.dialogContent}
            maxWidth="lg"
            withCloseButton={false}
            withNativeCloseBehavior
        >
            <CustomGrid
                container
                wrap="nowrap"
            >
                <CustomGrid className={styles.templatePreview}>
                    <TagItem
                        label={previewTemplate?.draft ? "Pending" : "Published"}
                        color={previewTemplate?.draft ? "#BDC8D3" : "#30BE39"}
                        className={styles.roomStatusLabel}
                    />
                    <ConditionalRender condition={Boolean(previewImage?.id)}>
                        <CustomImage
                            src={previewImage?.url || ''}
                            layout="fill"
                            objectFit="cover"
                            objectPosition="center"
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
                        {/*<BusinessCategoryTagsClip*/}
                        {/*    lines={1}*/}
                        {/*    maxWidth={210}*/}
                        {/*    tags={previewTemplate?.businessCategories}*/}
                        {/*/>*/}
                        <CustomGrid
                            container
                            className={styles.templateType}
                            justifyContent="flex-end"
                            gap={1}
                            wrap="nowrap"
                        >
                            <CustomGrid
                                item
                                alignItems="center"
                                className={clsx(styles.templatePayment, { [styles.paid]: Boolean(priceInCents) })}
                            >
                                <PaymentIcon width="22px" height="22px" />
                                <CustomTypography
                                    variant="body2"
                                    color={priceInCents ? 'colors.blue.primary' : 'colors.green.primary'}
                                >
                                    {priceInCents
                                        ? priceInCents / 100
                                        : previewTemplate?.type
                                    }
                                </CustomTypography>
                            </CustomGrid>
                            {/*<TemplateParticipants*/}
                            {/*    number={*/}
                            {/*        previewTemplate?.maxParticipants || 0*/}
                            {/*    }*/}
                            {/*/>*/}
                        </CustomGrid>
                    </CustomGrid>
                    <CustomTypography
                        className={styles.name}
                        variant="h2bold"
                    >
                        {previewTemplate?.name || ''}
                    </CustomTypography>
                    <CustomTypography className={styles.description}>
                        {previewTemplate?.description || ''}
                    </CustomTypography>
                    <ButtonsGroup
                        className={styles.buttons}
                    >
                        <CustomButton
                            onClick={() => {}}
                            className={styles.statisticsButton}
                            Icon={<StatisticsIcon width="28px" height="28px" />}
                            label={
                                <Translation
                                    nameSpace="rooms"
                                    translation="buttons.statistics"
                                />
                            }
                        />
                        <CustomButton
                            onClick={() => {}}
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
    )
})