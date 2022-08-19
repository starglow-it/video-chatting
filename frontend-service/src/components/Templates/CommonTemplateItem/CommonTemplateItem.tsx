import React, { memo, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useStoreMap, useStore } from 'effector-react';
import { Fade } from '@mui/material';
import clsx from 'clsx';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomButton } from '@library/custom/CustomButton/CustomButton';
import { ConditionalRender } from '@library/common/ConditionalRender/ConditionalRender';

// components
import { TemplateMainInfo } from '@components/Templates/TemplateMainInfo/TemplateMainInfo';

// stores
import {
    $isBusinessSubscription,
    $profileStore,
    $profileTemplatesStore,
    addNotificationEvent,
    appDialogsApi,
    getUserTemplateFx,
    setPreviewTemplate,
} from '../../../store';

// types
import { AppDialogsEnum, NotificationType } from '../../../store/types';
import { CommonTemplateItemProps } from './types';

// styles
import styles from './CommonTemplateItem.module.scss';

const CommonTemplateItem = memo(({ template, onChooseTemplate }: CommonTemplateItemProps) => {
    const profile = useStore($profileStore);
    const isBusinessSubscription = useStore($isBusinessSubscription);

    const freeTemplatesCount = useStoreMap({
        store: $profileTemplatesStore,
        keys: [],
        fn: state => state?.list?.filter(t => t.type === 'free')?.length || 0,
    });

    const isTemplatesLimitReached = profile.maxTemplatesNumber <= freeTemplatesCount;
    const isTimeLimitReached =
        profile.maxMeetingTime === 0 && !isBusinessSubscription && template.type !== 'paid';

    const [showPreview, setShowPreview] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

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

    useEffect(() => {
        (async () => {
            const userTemplate = await getUserTemplateFx({ templateId: template.templateId });

            if (userTemplate?.id) {
                setIsDisabled(true);
            }
        })();
    }, []);

    const handleStartMeeting = useCallback(async () => {
        onChooseTemplate(template.id);
    }, [onChooseTemplate]);

    const previewImage = (template?.previewUrls || []).find(image => image.resolution === 240);

    const handleShowToast = () => {
        addNotificationEvent({
            type: NotificationType.NoTimeLeft,
            message: `subscriptions.noTimeLeft`,
        });
    };

    const handleBuyTemplate = () => {
        onChooseTemplate(template.id);
    };

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
                <Image src={previewImage?.url || ''} width="334px" height="190px" />
            </ConditionalRender>
            <TemplateMainInfo
                show={!showPreview}
                name={template.name}
                description={template.description}
                maxParticipants={template.maxParticipants}
                type={template.type}
                priceInCents={template.priceInCents}
                isNeedToShowBusinessInfo
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
                        nameSpace="templates"
                        translation={isFree ? freeTemplateTranslation : 'buttons.buy'}
                    />
                    <CustomButton
                        className={styles.button}
                        variant="custom-transparent"
                        nameSpace="templates"
                        translation="buttons.preview"
                        onClick={handlePreviewTemplate}
                    />
                </CustomGrid>
            </Fade>
        </CustomGrid>
    );
});

export { CommonTemplateItem };
