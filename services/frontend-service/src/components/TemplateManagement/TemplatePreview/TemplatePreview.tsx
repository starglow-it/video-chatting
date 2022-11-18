import React, { memo, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useStore } from 'effector-react';

// custom
import { CustomGrid } from 'shared-frontend/library';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomDivider } from 'shared-frontend/library';
import { TagItem } from '@library/common/TagItem/TagItem';
import { ActionButton } from '@library/common/ActionButton/ActionButton';
import { CustomButton } from 'shared-frontend/library';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';

// components
import { UserVideoStub } from '@components/TemplateManagement/EditAttendeesPosition/UserVideoStub/UserVideoStub';

// types
import { ParticipantPosition } from '@containers/CreateRoomContainer/types';
import { TemplatePreviewProps } from '@components/TemplateManagement/TemplatePreview/types';

// icons
import { ArrowLeftIcon } from 'shared-frontend/icons';

// store
import { Translation } from '@library/common/Translation/Translation';
import { $windowSizeStore } from '../../../store';

// const
import frontendConfig from '../../../const/config';

// styles
import styles from './TemplatePreview.module.scss';

const Component = ({ onPreviousStep, onSubmit, controlPanelRef }: TemplatePreviewProps) => {
    const { control } = useFormContext();

    const description = useWatch({ control, name: 'description' });
    const customLink = useWatch({ control, name: 'customLink' });
    const tags = useWatch({ control, name: 'tags' });
    const participantsPositions = useWatch({ control, name: 'participantsPositions' });

    const { width } = useStore($windowSizeStore);

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
        () => tags.map(tag => <TagItem color={tag.color}>{tag.label}</TagItem>),
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
                <CustomTypography className={styles.description} variant="body2">
                    {description}
                </CustomTypography>
                <CustomDivider className={styles.divider} />
                <CustomTypography variant="body2" className={styles.link}>
                    {`${frontendConfig.frontendUrl}/.../${customLink}`}
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
        const top = clientHeight + clientTop - 14;
        return { top };
    }, [width]);

    return (
        <CustomGrid container className={styles.wrapper}>
            <CustomGrid container className={styles.participants}>
                {participantStubs}
            </CustomGrid>
            <CustomPaper variant="black-glass" style={tooltipStyle} className={styles.paper}>
                {tooltipTitle}
            </CustomPaper>
            <CustomGrid
                container
                gap={1.5}
                flexWrap="nowrap"
                justifyContent="center"
                className={styles.buttonsGroup}
            >
                <ActionButton
                    variant="gray"
                    Icon={<ArrowLeftIcon width="32px" height="32px" />}
                    className={styles.actionButton}
                    onAction={onPreviousStep}
                />
                <CustomButton
                    label={<Translation nameSpace="createRoom" translation="actions.submit" />}
                    onClick={onSubmit}
                    className={styles.button}
                />
            </CustomGrid>
        </CustomGrid>
    );
};

export const TemplatePreview = memo(Component);
