import React, { memo, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';
import { CustomBox } from '@library/custom/CustomBox/CustomBox';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomDivider } from '@library/custom/CustomDivider/CustomDivider';
import { TagItem } from '@library/common/TagItem/TagItem';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';

// components
import { UserVideoStub } from '@components/CreateRoom/EditAttendeesPosition/UserVideoStub/UserVideoStub';

// types
import { ParticipantPosition } from '@containers/CreateRoomContainer/types';
import { TemplatePreviewProps } from '@components/CreateRoom/TemplatePreview/types';

// icons
import { ArrowLeftIcon } from '@library/icons/ArrowLeftIcon';

// const
import frontendConfig from '../../../const/config';

// styles
import styles from './TemplatePreview.module.scss';

const Component = ({ onPreviousStep, onSubmit, controlPanelRef }: TemplatePreviewProps) => {
    const { control } = useFormContext();

    const description = useWatch({ control, name: 'description' });
    const customLink = useWatch({ control, name: 'customLink' });
    const templateId = useWatch({ control, name: 'templateId' });
    const tags = useWatch({ control, name: 'tags' });
    const participantsPositions = useWatch({ control, name: 'participantsPositions' });

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

    const tagsChips = useMemo(
        () => tags.map((tag: string) => <TagItem className={styles.tag}>{tag}</TagItem>),
        [tags],
    );

    const tooltipTitle = useMemo(
        () => (
            <CustomGrid container direction="column">
                <CustomTypography
                    variant="body2bold"
                    nameSpace="createRoom"
                    translation="preview.about"
                    className={styles.title}
                />
                <CustomTypography variant="body2">{description}</CustomTypography>
                <CustomDivider className={styles.divider} />
                <CustomTypography variant="body2" className={styles.link}>
                    {`${frontendConfig.frontendUrl}/.../${customLink || templateId}`}
                </CustomTypography>
                <CustomGrid container gap={1}>
                    {tagsChips}
                </CustomGrid>
            </CustomGrid>
        ),
        [description, customLink, tagsChips],
    );

    const tooltipStyle = useMemo(() => {
        if (!controlPanelRef?.current) {
            return {};
        }
        const { clientHeight, clientTop } = controlPanelRef.current;
        const top = clientHeight + clientTop - 20;
        return { top };
    }, []);

    return (
        <CustomGrid container className={styles.wrapper}>
            <CustomGrid container className={styles.participants}>
                {participantStubs}
            </CustomGrid>
            <CustomTooltip
                open
                variant="black-glass"
                placement="bottom-start"
                title={tooltipTitle}
                popperClassName={styles.popper}
            >
                <CustomBox className={styles.tooltipPosition} style={tooltipStyle} />
            </CustomTooltip>

            <CustomGrid
                container
                gap={1.5}
                flexWrap="nowrap"
                justifyContent="center"
                className={styles.buttonsGroup}
            >
                <ActionButton
                    variant="gray"
                    Icon={<ArrowLeftIcon width="24px" height="24px" />}
                    className={styles.actionButton}
                    onAction={onPreviousStep}
                />
                <CustomButton
                    nameSpace="createRoom"
                    translation="actions.submit"
                    onClick={onSubmit}
                    className={styles.button}
                />
            </CustomGrid>
        </CustomGrid>
    );
};

export const TemplatePreview = memo(Component);
