import React, { memo, useCallback, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Fade } from '@mui/material';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';

// icon
import { DeleteIcon } from '@library/icons/DeleteIcon';

// common
import { ActionButton } from '@library/common/ActionButton/ActionButton';

// components
import { TemplateMainInfo } from '@components/Templates/TemplateMainInfo/TemplateMainInfo';
import {TemplateAvatarWithInfo} from "@components/Templates/TemplateAvatarWithInfo/TemplateAvatarWithInfo";

// stores
import { createMeetingFx } from '../../../store/meetings';
import { appDialogsApi } from '../../../store/dialogs';

// styles
import styles from './ProfileTemplateItem.module.scss';

// stores
import { setScheduleTemplateIdEvent } from "../../../store/templates";
import { setDeleteTemplateIdEvent } from '../../../store/profile';

// types
import { ProfileTemplateProps } from './types';
import { AppDialogsEnum } from '../../../store/types';

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
        await createMeetingFx({ templateId: template.id });

        await router.push(`/meeting/${template.id}`);
    }, []);

    const handleOpenDeleteDialog = useCallback(() => {
        setDeleteTemplateIdEvent(template.id);
        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.deleteTemplateDialog,
        });
    }, [template.id]);

    const handleScheduleMeeting = useCallback(() => {
        setScheduleTemplateIdEvent(template.id);

        appDialogsApi.openDialog({
            dialogKey: AppDialogsEnum.scheduleMeetingDialog,
        });
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
            <TemplateMainInfo
                avatar={template?.user?.profileAvatar?.url}
                show={!showPreview}
                name={template.name}
                description={template.description}
                maxParticipants={template.maxParticipants}
                type={template.type}
                isNeedToShowBusinessInfo
            />
            <Fade in={showPreview}>
                <CustomGrid container direction="column" justifyContent="space-between" className={styles.templateMenu}>
                    <TemplateAvatarWithInfo
                        className={styles.avatar}
                        name={template.name}
                        description={template.description}
                        avatar={template?.user?.profileAvatar?.url}
                    />
                    <CustomGrid
                        container
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
                        <CustomButton
                            variant="custom-transparent"
                            onClick={handleScheduleMeeting}
                            className={styles.startMeetingBtn}
                            nameSpace="templates"
                            translation="buttons.schedule"
                            typographyProps={{
                                variant: 'body2',
                            }}
                        />
                    </CustomGrid>
                    <ActionButton
                        variant="transparent"
                        onAction={handleOpenDeleteDialog}
                        className={styles.deleteBtn}
                        Icon={<DeleteIcon width="22px" height="22px" />}
                    />
                </CustomGrid>
            </Fade>
        </CustomGrid>
    );
});

export { ProfileTemplateItem };
