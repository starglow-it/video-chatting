import React, { memo, useCallback, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Fade } from '@mui/material';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';

// icon
import { EditIcon } from '@library/icons/EditIcon';
import { AddPeopleIcon } from '@library/icons/AddPeopleIcon';

// common
import { ActionButton } from '@library/common/ActionButton/ActionButton';

// components
import { TemplateMainInfo } from '@components/Templates/TemplateMainInfo/TemplateMainInfo';

// stores
import { createMeetingFx } from '../../../store/meetings';

// styles
import styles from './ProfileTemplateItem.module.scss';

// types
import { ProfileTemplateProps } from './types';

const ProfileTemplateItem = memo(({ template }: ProfileTemplateProps) => {
    const router = useRouter();
    const [showPreview, setShowPreview] = useState(false);

    const handleShowPreview = useCallback(() => {
        setShowPreview(true);
    }, []);

    const handleHidePreview = useCallback(() => {
        setShowPreview(false);
    }, []);

    const handleCreateMeeting = useCallback(async () => {
        const result = await createMeetingFx({ templateId: template.id });

        if (result.meeting) {
            await router.push(`/meeting/${result.meeting.id}`);
        }
    }, []);

    const handleEditTemplate = useCallback(() => {
        router.push(`/meeting/edit-template/${template.id}`);
    }, []);

    return (
        <CustomGrid
            className={styles.templateContent}
            container
            justifyContent="center"
            alignItems="center"
            onMouseEnter={handleShowPreview}
            onMouseLeave={handleHidePreview}
        >
            <Image src={template.previewUrl} width="334px" height="190px" />
            <Fade in={!showPreview}>
                <TemplateMainInfo
                    name={template.name}
                    description={template.description}
                    maxParticipants={template.maxParticipants}
                    type={template.type}
                />
            </Fade>
            <Fade in={showPreview}>
                <CustomGrid
                    className={styles.templateButtons}
                    container
                    justifyContent="center"
                    alignItems="center"
                    wrap="nowrap"
                    gap={1.5}
                >
                    <CustomButton
                        onClick={handleCreateMeeting}
                        className={styles.startMeetingBtn}
                        nameSpace="templates"
                        translation="buttons.startMeeting"
                        typographyProps={{
                            variant: 'body2',
                        }}
                    />
                    <ActionButton
                        onAction={handleEditTemplate}
                        className={styles.editBtn}
                        Icon={<EditIcon width="22px" height="22px" />}
                    />
                    <ActionButton
                        className={styles.editBtn}
                        Icon={<AddPeopleIcon width="22px" height="22px" />}
                    />
                </CustomGrid>
            </Fade>
        </CustomGrid>
    );
});

export { ProfileTemplateItem };
