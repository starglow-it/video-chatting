import React, {memo, useMemo} from "react";

// shared
import {CustomGrid} from "shared-frontend/library/custom/CustomGrid";
import {CustomDivider} from "shared-frontend/library/custom/CustomDivider";
import {CustomPaper} from "shared-frontend/library/custom/CustomPaper";
import {CustomTypography} from "shared-frontend/library/custom/CustomTypography";
import {TagItem} from "shared-frontend/library/common/TagItem";
import {ActionButton} from "shared-frontend/library/common/ActionButton";
import {ArrowLeftIcon} from "shared-frontend/icons/OtherIcons/ArrowLeftIcon";
import {
    UserVideoStub
} from '@components/CreateRoom/UserVideoStub/UserVideoStub';
// components
import { Translation } from "@components/Translation/Translation";

// styles
import styles from './TemplatePreview.module.scss';

// types
import {TemplatePreviewProps} from "./TemplatePreviewProps.types";
import {ParticipantPosition} from "shared-frontend/types";
import {TemplateLinkItem} from "@components/CreateRoom/TemplateLinks/TemplateLinkItem";

export const TemplatePreview = memo(({
     onPreviousStep,
     participantsPositions,
     templateTags,
     description,
     templateLinks
}: TemplatePreviewProps) => {
    const participantStubs = useMemo(
        () =>
            participantsPositions.map(({ id, top, left }: ParticipantPosition, index: number) => (
                <UserVideoStub
                    isDraggable={false}
                    stubId={id}
                    index={index}
                    position={{ top: top / 100, left: left / 100 }}
                />
            )),
        [participantsPositions],
    );

    const tagsChips = useMemo(() => {
        return templateTags.map(tag => <TagItem color={tag.color} label={tag.label} />)
    }, [templateTags]);

    const renderLinks = useMemo(() =>
        templateLinks.map((link, index) => (
            <TemplateLinkItem
                key={link?.key}
                index={index}
                isStatic
                data={link}
            />
        )), [templateLinks]);

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
            <CustomGrid
                container
                gap={1.5}
                flexWrap="nowrap"
                justifyContent="center"
                className={styles.buttonsGroup}
            >
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
            </CustomGrid>
        </CustomGrid>
    )
})
