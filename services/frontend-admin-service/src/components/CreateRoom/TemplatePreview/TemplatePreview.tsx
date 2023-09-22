import { memo, useMemo } from 'react';

// shared
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomDivider } from 'shared-frontend/library/custom/CustomDivider';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { TagItem } from 'shared-frontend/library/common/TagItem';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';

// components
import { ButtonsGroup } from '@components/ButtonsGroup/ButtonsGroup';
import { TemplateLinkItem } from '@components/CreateRoom/TemplateLinks/TemplateLinkItem';
import { UserVideoStub } from '@components/CreateRoom/UserVideoStub/UserVideoStub';
import { Translation } from '@components/Translation/Translation';

// stores
import { ParticipantPosition } from 'shared-frontend/types';

// types
import { TemplatePreviewProps } from './TemplatePreview.types';

// styles
import styles from './TemplatePreview.module.scss';

const TemplatePreview = memo(
    ({
        onPreviousStep,
        participantsPositions,
        templateTags,
        description,
        templateLinks,
        submitButtons,
    }: TemplatePreviewProps) => {
        const participantStubs = useMemo(
            () =>
                participantsPositions.map(
                    ({ id, top, left }: ParticipantPosition, index: number) => (
                        <UserVideoStub
                            key={id}
                            isDraggable={false}
                            stubId={id}
                            index={index}
                            position={{
                                top,
                                left,
                            }}
                        />
                    ),
                ),
            [participantsPositions],
        );

        const tagsChips = useMemo(
            () =>
                templateTags.map(tag => (
                    <TagItem key={tag.id} color={tag.color} label={tag.label} />
                )),
            [templateTags],
        );

        const renderLinks = useMemo(
            () =>
                templateLinks.map((link, index: number) => (
                    <TemplateLinkItem
                        key={link?.key}
                        index={index}
                        isStatic
                        data={link}
                    />
                )),
            [templateLinks],
        );

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
                        {templateTags?.length ? (
                            <CustomDivider className={styles.divider} />
                        ) : null}
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
                        Icon={<ArrowLeftIcon width="32px" height="32px" />}
                        className={styles.actionButton}
                        onAction={onPreviousStep}
                    />
                    {submitButtons}
                </ButtonsGroup>
            </CustomGrid>
        );
    },
);

TemplatePreview.displayName = 'TemplatePreview';

export { TemplatePreview };
