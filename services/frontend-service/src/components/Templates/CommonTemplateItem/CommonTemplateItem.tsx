import React, { memo, useCallback, useState } from 'react';
import { useStore } from 'effector-react';
import { Fade } from '@mui/material';
import clsx from 'clsx';

// custom
import { CustomGrid } from 'shared-frontend/library';
import { CustomButton } from 'shared-frontend/library';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { TemplateMainInfo } from '@components/Templates/TemplateMainInfo/TemplateMainInfo';

// shared
import { CustomImage } from 'shared-frontend/library';

// stores
import { Translation } from '@library/common/Translation/Translation';
import {
    $isBusinessSubscription,
    $profileStore,
    $profileTemplatesCountStore,
    addNotificationEvent,
    addTemplateToUserFx,
    appDialogsApi,
    setPreviewTemplate,
} from '../../../store';

// types
import { AppDialogsEnum, NotificationType } from '../../../store/types';
import { CommonTemplateItemProps } from './types';

// styles
import styles from './CommonTemplateItem.module.scss';

const Component = ({ template, onChooseTemplate }: CommonTemplateItemProps) => {
    const profile = useStore($profileStore);
    const { state: profileTemplatesCount } = useStore($profileTemplatesCountStore);

    const isBusinessSubscription = useStore($isBusinessSubscription);
    const isAddTemplateInProgress = useStore(addTemplateToUserFx.pending);

    const isTemplatesLimitReached = profile.maxTemplatesNumber <= profileTemplatesCount.count;
    const isTimeLimitReached = profile.maxMeetingTime === 0 && !isBusinessSubscription;

    const [showPreview, setShowPreview] = useState(false);

    const isDisabled = template.isTemplatePurchased;

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

    const handleStartMeeting = useCallback(async () => {
        await onChooseTemplate?.(template.id);
    }, [onChooseTemplate]);

    const previewImage = (template?.previewUrls || []).find(image => image.resolution === 240);

    const handleShowToast = () => {
        addNotificationEvent({
            type: NotificationType.NoTimeLeft,
            message: `subscriptions.noTimeLeft`,
        });
    };

    const handleBuyTemplate = useCallback(async () => {
        await onChooseTemplate?.(template.id);
    }, [onChooseTemplate]);

    const isFree = !template.priceInCents;

    const freeTemplateTranslation = isTemplatesLimitReached
        ? 'buttons.replace'
        : 'buttons.startMeeting';

    const freeTemplateHandler = !isTimeLimitReached ? handleStartMeeting : undefined;
    const paidTemplateHandler = !(!isFree && isDisabled) ? handleBuyTemplate : undefined;

    const freeTemplateHover = isTimeLimitReached ? handleShowToast : undefined;

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
                <CustomImage src={previewImage?.url || ''} width="334px" height="190px" />
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
            />
            <Fade in={showPreview}>
                <CustomGrid
                    container
                    justifyContent="center"
                    alignItems="center"
                    className={styles.templateButtons}
                >
                    <CustomButton
                        onMouseEnter={isFree ? freeTemplateHover : undefined}
                        onClick={isFree ? freeTemplateHandler : paidTemplateHandler}
                        className={clsx(styles.button, {
                            [styles.disabled]:
                                (isFree && isTimeLimitReached) || (!isFree && isDisabled),
                        })}
                        disableRipple={(isFree && isTimeLimitReached) || (!isFree && isDisabled)}
                        disabled={isAddTemplateInProgress}
                        label={
                            <Translation
                                nameSpace="templates"
                                translation={isFree ? freeTemplateTranslation : 'buttons.buy'}
                            />
                        }
                    />
                    <CustomButton
                        label={<Translation nameSpace="templates" translation="buttons.preview" />}
                        className={styles.button}
                        variant="custom-transparent"
                        onClick={handlePreviewTemplate}
                    />
                </CustomGrid>
            </Fade>
        </CustomGrid>
    );
};

export const CommonTemplateItem = memo(Component);
