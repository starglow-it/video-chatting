import React, { memo, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { Fade } from '@mui/material';
import clsx from 'clsx';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';

// components
import { TemplateMainInfo } from '@components/Templates/TemplateMainInfo/TemplateMainInfo';

// stores
import { Translation } from '@library/common/Translation/Translation';
import { IUserTemplate } from 'shared-types';
import { setPreviewTemplate, appDialogsApi } from '../../../store';

// styles
import styles from './DiscoverTemplateItem.module.scss';

// types
import { AppDialogsEnum } from '../../../store/types';
import { getClientMeetingUrl } from '../../../utils/urls';

const DiscoverTemplateItem = memo(
    ({ template }: { template: IUserTemplate }) => {
        const router = useRouter();

        const [showPreview, setShowPreview] = useState(false);

        const handleShowPreview = useCallback(() => {
            setShowPreview(true);
        }, []);

        const handleHidePreview = useCallback(() => {
            setShowPreview(false);
        }, []);

        const handlePreviewTemplate = useCallback(() => {
            setPreviewTemplate(template);
            appDialogsApi.openDialog({
                dialogKey: AppDialogsEnum.templatePreviewDialog,
            });
        }, []);

        const handleEnterWaitingRoomTemplate = useCallback(() => {
            router.push(getClientMeetingUrl(template.id));
        }, []);

        const previewImage = (template?.previewUrls || []).find(
            image => image.resolution === 240,
        );

        return (
            <CustomGrid
                className={clsx(styles.templateContent, {
                    [styles.blurred]: showPreview,
                })}
                container
                justifyContent="center"
                alignItems="center"
                onMouseEnter={handleShowPreview}
                onMouseLeave={handleHidePreview}
            >
                <ConditionalRender condition={Boolean(previewImage?.url)}>
                    <CustomImage src={previewImage?.url ?? ''} layout="fill" />
                </ConditionalRender>
                <TemplateMainInfo
                    show={!showPreview}
                    name={template.name}
                    description={template.description}
                    maxParticipants={template.maxParticipants}
                    type={template.type}
                />
                <Fade in={showPreview}>
                    <CustomGrid
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        className={styles.templateButtons}
                        gap={1.5}
                    >
                        <CustomButton
                            onClick={handleEnterWaitingRoomTemplate}
                            className={styles.button}
                            label={
                                <Translation
                                    nameSpace="templates"
                                    translation="buttons.startMeeting"
                                />
                            }
                        />
                        <CustomButton
                            onClick={handlePreviewTemplate}
                            className={styles.button}
                            variant="custom-transparent"
                            label={
                                <Translation
                                    nameSpace="templates"
                                    translation="buttons.previewSpace"
                                />
                            }
                        />
                    </CustomGrid>
                </Fade>
            </CustomGrid>
        );
    },
);

export { DiscoverTemplateItem };
