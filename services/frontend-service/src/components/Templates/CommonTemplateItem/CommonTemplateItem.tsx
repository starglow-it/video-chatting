import React, { memo, useCallback, useState } from 'react';
import { useStore } from 'effector-react';
import { Fade } from '@mui/material';
import clsx from 'clsx';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { Translation } from '@library/common/Translation/Translation';

// components
import { TemplateMainInfo } from '@components/Templates/TemplateMainInfo/TemplateMainInfo';

// stores
import { addTemplateToUserFx } from '../../../store';

// types
import { CommonTemplateItemProps } from './types';

// styles
import styles from './CommonTemplateItem.module.scss';

const Component = ({ template, onChooseTemplate }: CommonTemplateItemProps) => {
    const isAddTemplateInProgress = useStore(addTemplateToUserFx.pending);

    const [showPreview, setShowPreview] = useState(false);

    const isDisabled = template.isTemplatePurchased;

    const handleShowPreview = useCallback(() => {
        setShowPreview(true);
    }, []);

    const handleHidePreview = useCallback(() => {
        setShowPreview(false);
    }, []);

    const handleStartMeeting = useCallback(async () => {
        await onChooseTemplate?.(template.id);
    }, [onChooseTemplate]);

    const previewImage = (template?.previewUrls || []).find(
        image => image.resolution === 240,
    );

    const handleBuyTemplate = useCallback(async () => {
        await onChooseTemplate?.(template.id);
    }, [onChooseTemplate]);

    const isFree = !template.priceInCents;

    const paidTemplateHandler = !(!isFree && isDisabled)
        ? handleBuyTemplate
        : undefined;

    return (
        <CustomGrid
            className={styles.templateContent}
            container
            justifyContent="center"
            alignItems="center"
            onMouseEnter={handleShowPreview}
            onMouseLeave={handleHidePreview}
        >
            <ConditionalRender condition={Boolean(previewImage?.url)}>
                <CustomImage
                    src={previewImage?.url || ''}
                    width="334px"
                    height="190px"
                />
            </ConditionalRender>
            <TemplateMainInfo
                show={!showPreview}
                name={template.name}
                description={template.description}
                maxParticipants={template.maxParticipants}
                type={template.type}
                priceInCents={template.priceInCents}
                isNeedToShowBusinessInfo
                isCommonTemplate
                authorRole={template.authorRole}
                authorThumbnail={template.authorThumbnail}
            />
            <Fade in={showPreview}>
                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="center"
                    className={styles.templateButtons}
                >
                    <CustomButton
                        onClick={
                            isFree ? handleStartMeeting : paidTemplateHandler
                        }
                        className={clsx(styles.button, {
                            [styles.disabled]: !isFree && isDisabled,
                        })}
                        disableRipple={!isFree && isDisabled}
                        disabled={isAddTemplateInProgress}
                        label={
                            <Translation
                                nameSpace="templates"
                                translation={
                                    isFree
                                        ? 'buttons.startMeeting'
                                        : 'buttons.buy'
                                }
                            />
                        }
                    />
                </CustomGrid>
            </Fade>
        </CustomGrid>
    );
};

export const CommonTemplateItem = memo(Component);
