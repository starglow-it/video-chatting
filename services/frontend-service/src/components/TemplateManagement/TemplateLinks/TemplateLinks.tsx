import { memo, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { getRandomNumber } from 'shared-utils';

// shared
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';
import { ArrowRightIcon } from 'shared-frontend/icons/OtherIcons/ArrowRightIcon';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomButton } from 'shared-frontend/library/custom/CustomButton';
import { CustomLinkIcon } from 'shared-frontend/icons/OtherIcons/CustomLinkIcon';
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';

import { Translation } from '@library/common/Translation/Translation';

// styles
import { NotificationType } from 'src/store/types';
import { $isBusinessSubscription, addNotificationEvent } from 'src/store';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { useStore } from 'effector-react';
import styles from './TemplateLinks.module.scss';

import { TemplateLinkItem } from './TemplateLinkItem';
import { TemplatesLinksProps } from './TemplateLinks.types';

const Component = ({
    onNextStep,
    onPreviousStep,
    onUpgrade,
}: TemplatesLinksProps) => {
    const isBusinessSubscription = useStore($isBusinessSubscription);
    const { control, trigger } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'templateLinks',
    });

    const isAddLinkDisabled = fields.length === 5;

    const handleRemoveTemplateLink = useCallback((index: number) => {
        remove(index);
    }, []);

    const renderLinks = useMemo(
        () =>
            fields.map((link, index) => (
                <TemplateLinkItem
                    key={link?.key ?? link?.id}
                    index={index}
                    onRemove={handleRemoveTemplateLink}
                    data={link}
                    isDraggable
                />
            )),
        [fields],
    );

    const handleAddLinkInput = useCallback(() => {
        if (isAddLinkDisabled) {
            return;
        }

        append({
            value: '',
            key: getRandomNumber(100),
            title: '',
            top: 0.5,
            left: 0.5,
            type: 'add',
        });
    }, [isAddLinkDisabled]);

    const handleClickNextStep = useCallback(async () => {
        const isNextClickValidation = await trigger('templateLinks');

        if (isNextClickValidation) {
            onNextStep();
        } else {
            addNotificationEvent({
                message: 'errors.invalidUrl',
                withErrorIcon: true,
                type: NotificationType.validationError,
            });
        }
    }, []);

    return (
        <CustomGrid
            container
            className={styles.wrapper}
            alignItems="center"
            justifyContent="center"
        >
            <ConditionalRender condition={!isBusinessSubscription}>
                <CustomPaper
                    className={styles.paperUpgrade}
                    variant="black-glass"
                >
                    <CustomGrid
                        container
                        alignItems="center"
                        justifyContent="flex-start"
                        direction="column"
                        className={styles.mainUpgrade}
                        height="100%"
                        padding={4}
                    >
                        <CustomTypography
                            variant="h2"
                            fontSize={30}
                            color="colors.white.primary"
                        >
                            <Translation
                                nameSpace="createRoom"
                                translation="upgrade.embedYourLinks"
                            />
                        </CustomTypography>
                        <CustomTypography
                            variant="h4"
                            marginTop={7}
                            color="colors.white.primary"
                        >
                            <Translation
                                nameSpace="createRoom"
                                translation="upgrade.businessMembership"
                            />
                        </CustomTypography>
                        <CustomTypography
                            marginTop={4}
                            color="colors.white.primary"
                        >
                            <Translation
                                nameSpace="createRoom"
                                translation="upgrade.embedLinks"
                            />
                        </CustomTypography>
                        <CustomTypography color="colors.white.primary">
                            +
                        </CustomTypography>
                        <CustomTypography color="colors.white.primary">
                            <Translation
                                nameSpace="createRoom"
                                translation="upgrade.commission"
                            />
                        </CustomTypography>
                        <CustomButton
                            label={
                                <Translation
                                    nameSpace="createRoom"
                                    translation="upgrade.button"
                                />
                            }
                            className={styles.buttonUpgrade}
                            onClick={onUpgrade}
                        />
                    </CustomGrid>
                </CustomPaper>
            </ConditionalRender>
            <ConditionalRender condition={isBusinessSubscription}>
                <CustomTooltip
                    title={
                        isAddLinkDisabled ? (
                            <Translation
                                nameSpace="createRoom"
                                translation="tooltips.addLinkDisabled"
                            />
                        ) : (
                            ''
                        )
                    }
                >
                    <CustomButton
                        onClick={handleAddLinkInput}
                        className={clsx(styles.addLinkButton, {
                            [styles.disabled]: isAddLinkDisabled,
                        })}
                        label={
                            <CustomTypography variant="body2">
                                <Translation
                                    nameSpace="createRoom"
                                    translation="addLink"
                                />
                            </CustomTypography>
                        }
                        Icon={<CustomLinkIcon width="24px" height="24px" />}
                    />
                </CustomTooltip>
                {renderLinks}
            </ConditionalRender>
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
                <ActionButton
                    variant="accept"
                    Icon={<ArrowRightIcon width="32px" height="32px" />}
                    className={styles.actionButton}
                    onAction={handleClickNextStep}
                />
            </CustomGrid>
        </CustomGrid>
    );
};

export const TemplateLinks = memo(Component);
