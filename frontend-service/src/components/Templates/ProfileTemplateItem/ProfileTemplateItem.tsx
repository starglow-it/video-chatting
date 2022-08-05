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
import { TemplateInfo } from '@components/Templates/TemplateInfo/TemplateInfo';

// stores
import {
    appDialogsApi,
    createMeetingFx,
    setDeleteTemplateIdEvent,
    setScheduleTemplateIdEvent,
} from '../../../store';

// styles
import styles from './ProfileTemplateItem.module.scss';

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

        await router.push(`/meeting/${template.customLink || template.id}`);
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

    const previewImage = (template?.previewUrls || []).find(preview => preview.resolution === 240);

    return (
        <CustomGrid
            className={styles.templateContent}
            container
            justifyContent="center"
            alignItems="center"
            onMouseEnter={handleShowPreview}
            onMouseLeave={handleHidePreview}
        >
            {previewImage?.url
                ? (
                    <Image
                        src={previewImage.url}
                        width="334px"
                        height="190px"
                    />
                )
                : null
            }
            <TemplateMainInfo
                show={!showPreview}
                name={template.name}
                description={template.description}
                maxParticipants={template.maxParticipants}
                type={template.type}
                isNeedToShowBusinessInfo
            />
            <Fade in={showPreview}>
                <CustomGrid
                    container
                    direction="column"
                    justifyContent="space-between"
                    className={styles.templateMenu}
                >
                    <TemplateInfo
                        className={styles.avatar}
                        name={template.name}
                        description={template.description}
                    />
                    <CustomGrid container wrap="nowrap" gap={1.5}>
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
