import React, {memo, useCallback, useMemo} from "react";

// shared
import {CustomGrid} from "shared-frontend/library/custom/CustomGrid";
import {CustomDivider} from "shared-frontend/library/custom/CustomDivider";
import {CustomPaper} from "shared-frontend/library/custom/CustomPaper";
import {CustomTypography} from "shared-frontend/library/custom/CustomTypography";
import {TagItem} from "shared-frontend/library/common/TagItem";
import {ActionButton} from "shared-frontend/library/common/ActionButton";
import {ArrowLeftIcon} from "shared-frontend/icons/OtherIcons/ArrowLeftIcon";
import {CustomButton} from "shared-frontend/library/custom/CustomButton";

// components
import {ButtonsGroup} from "@components/ButtonsGroup/ButtonsGroup";
import {TemplateLinkItem} from "@components/CreateRoom/TemplateLinks/TemplateLinkItem";
import {UserVideoStub} from '@components/CreateRoom/UserVideoStub/UserVideoStub';
import {Translation} from "@components/Translation/Translation";

// styles
import styles from './TemplatePreview.module.scss';

// stores
import {openAdminDialogEvent} from "../../../store";

// types
import {TemplatePreviewProps} from "./TemplatePreviewProps.types";
import {ParticipantPosition} from "shared-frontend/types";
import {AdminDialogsEnum} from "../../../store/types";

export const TemplatePreview = memo(({
     onPreviousStep,
     participantsPositions,
     templateTags,
     description,
     templateLinks,
     onCreate
}: TemplatePreviewProps) => {
    const participantStubs = useMemo(
        () =>
            participantsPositions.map(({ id, top, left }: ParticipantPosition, index: number) => (
                <UserVideoStub
                    isDraggable={false}
                    stubId={id}
                    index={index}
                    position={{ top, left }}
                />
            )),
        [participantsPositions],
    );

    const tagsChips = useMemo(() => {
        return templateTags.map(tag => <TagItem color={tag.color} label={tag.label} />)
    }, [templateTags]);

    const renderLinks = useMemo(() =>
        templateLinks.map((link, index: number) => (
            <TemplateLinkItem
                key={link?.key}
                index={index}
                isStatic
                data={link}
            />
        )), [templateLinks]);

    const handleCreateRoom = useCallback(() => {
        onCreate({ isNeedToPublish: false })
    }, []);

    const handleOpenConfirmDialog = useCallback(() => {
        openAdminDialogEvent(AdminDialogsEnum.confirmCreateAndPublishRoomDialog)
    }, []);

    return (
        <CustomGrid container className={styles.wrapper}>
            <CustomPaper variant="black-glass" className={styles.paper}>
                <CustomGrid container direction="column">
                    <CustomTypography
                        variant="body2bold"
                        color="colors.white.primary"
                        className={styles.title}
                    >
                        <Translation
                            nameSpace="rooms"
                            translation="preview.about"
                        />
                    </CustomTypography>
                    <CustomTypography
                        color="colors.white.primary"
                        className={styles.description}
                        variant="body2"
                    >
                        {description}
                    </CustomTypography>
                    <CustomDivider className={styles.divider} />
                    <CustomGrid container gap={1}>
                        {tagsChips}
                    </CustomGrid>
                </CustomGrid>
            </CustomPaper>
            {participantStubs}
            {renderLinks}
            <ButtonsGroup className={styles.buttonsGroup}>
                <ActionButton
                    variant="gray"
                    Icon={(
                        <ArrowLeftIcon
                            width="32px"
                            height="32px"
                        />
                    )}
                    className={styles.actionButton}
                    onAction={onPreviousStep}
                />
                <CustomButton
                    className={styles.button}
                    onClick={handleCreateRoom}
                    label={(
                        <Translation nameSpace="rooms" translation="buttons.create" />
                    )}
                />
                <CustomButton
                    className={styles.button}
                    onClick={handleOpenConfirmDialog}
                    label={(
                        <Translation nameSpace="rooms" translation="buttons.createAndPublish" />
                    )}
                />
            </ButtonsGroup>
        </CustomGrid>
    )
})
