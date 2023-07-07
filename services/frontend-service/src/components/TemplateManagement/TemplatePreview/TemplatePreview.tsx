import React, { memo, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useStore } from 'effector-react';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomDivider } from 'shared-frontend/library/custom/CustomDivider';
import { TagItem } from 'shared-frontend/library/common/TagItem';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';

// components
import { UserVideoStub } from '@components/TemplateManagement/EditAttendeesPosition/UserVideoStub/UserVideoStub';
import { Translation } from '@library/common/Translation/Translation';

// types
import { ParticipantPosition } from '@containers/CreateRoomContainer/types';
import { TemplateLinkItem } from '@components/TemplateManagement/TemplateLinks/TemplateLinkItem';
import { TemplatePreviewProps } from './types';

// store
import { $windowSizeStore } from '../../../store';

// styles
import styles from './TemplatePreview.module.scss';

// const
import frontendConfig from '../../../const/config';

const Component = ({
    onPreviousStep,
    onSubmit,
    controlPanelRef,
}: TemplatePreviewProps) => {
    const { control } = useFormContext();

    const description = useWatch({ control, name: 'description' });
    const customLink = useWatch({ control, name: 'customLink' });
    const templateLinks = useWatch({ control, name: 'templateLinks' });
    const tags = useWatch({ control, name: 'tags' });
    const participantsPositions = useWatch({
        control,
        name: 'participantsPositions',
    });

    const { width } = useStore($windowSizeStore);

    const participantStubs = useMemo(
        () =>
            participantsPositions.map(
                ({ id, top, left }: ParticipantPosition, index: number) => (
                    <UserVideoStub
                        isDraggable={false}
                        stubId={id}
                        index={index}
                        position={{ top, left }}
                    />
                ),
            ),
        [participantsPositions],
    );

    const tagsChips = useMemo(
        () => tags.map(tag => <TagItem color={tag.color} label={tag.label} />),
        [tags],
    );

    const renderLinks = useMemo(
        () =>
            templateLinks?.map((link, index: number) => (
                <TemplateLinkItem
                    key={link?.key}
                    index={index}
                    isStatic
                    data={link}
                />
            )),
        [templateLinks],
    );

    const tooltipStyle = useMemo(() => {
        if (!controlPanelRef?.current) {
            return {};
        }
        const { clientHeight, clientTop } = controlPanelRef.current;
        const top = clientHeight + clientTop + 20;
        return { top };
    }, [width]);

    return (
        <CustomGrid container className={styles.wrapper}>
            <CustomGrid container className={styles.participants}>
                {participantStubs}
            </CustomGrid>
            <CustomPaper
                variant="black-glass"
                style={tooltipStyle}
                className={styles.paper}
            >
                <CustomGrid container direction="column">
                    <CustomTypography
                        variant="body2bold"
                        nameSpace="createRoom"
                        translation="preview.about"
                        className={styles.title}
                    />
                    <CustomTypography
                        className={styles.description}
                        variant="body2"
                    >
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
            </CustomPaper>
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
                    Icon={<ArrowLeftIcon width="32px" height="32px" />}
                    className={styles.actionButton}
                    onAction={onPreviousStep}
                />
                <CustomButton
                    label={
                        <Translation
                            nameSpace="createRoom"
                            translation="actions.submit"
                        />
                    }
                    onClick={onSubmit}
                    className={styles.button}
                />
            </CustomGrid>
        </CustomGrid>
    );
};

export const TemplatePreview = memo(Component);
