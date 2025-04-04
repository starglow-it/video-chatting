import React, {
    memo,
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import Draggable, {
    ControlPosition,
    DraggableData,
    DraggableEvent,
} from 'react-draggable';
import { useStore } from 'effector-react';
import { useFormContext } from 'react-hook-form';

import { roundNumberToPrecision } from 'shared-utils';

import { useToggle } from 'shared-frontend/hooks/useToggle';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';
import { RoundErrorIcon } from 'shared-frontend/icons/RoundIcons/RoundErrorIcon';
import { RoundSuccessIcon } from 'shared-frontend/icons/RoundIcons/RoundSuccessIcon';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';

import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

import { CustomInput } from 'shared-frontend/library/custom/CustomInput';
import { Translation } from '@library/common/Translation/Translation';
import { CustomAccordion } from 'shared-frontend/library/custom/CustomAccordion';
import { RoundArrowIcon } from 'shared-frontend/icons/RoundIcons/RoundArrowIcon';
import { NotificationType } from '../../../store/types';
import { TemplateLinkItemProps } from './TemplateLinks.types';
import { $windowSizeStore, addNotificationEvent } from '../../../store';
import styles from './TemplateLinks.module.scss';

const Component = ({
    index,
    isDraggable = false,
    isStatic = false,
    data: linkData,
    onRemove,
}: TemplateLinkItemProps) => {
    const { width, height } = useStore($windowSizeStore);

    const { register, setValue, trigger } = useFormContext();

    const {
        value: isActive,
        onSwitchOn: handleSetElementActive,
        onSwitchOff: handleSetElementInActive,
    } = useToggle(false);

    const inputKey = `templateLinks[${index}].value`;
    const titleKey = `templateLinks[${index}].title`;

    const registerData = useMemo(() => register(inputKey), [inputKey]);
    const { ref: refTitleData, ...registerTitleData } = useMemo(
        () => register(titleKey),
        [titleKey],
    );
    const titleRef = useRef<any>(null);

    const [draggablePosition, setDraggablePosition] = useState<ControlPosition>(
        {
            x: 0,
            y: 0,
        },
    );

    const contentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const xPosition =
            width * linkData.left - (contentRef.current?.clientWidth ?? 0) / 2;
        const yPosition =
            height * linkData.top - (contentRef.current?.clientHeight ?? 0) / 2;

        setDraggablePosition({
            x: xPosition,
            y: yPosition,
        });
    }, [width, height]);

    const handleDrag = useCallback((e: DraggableEvent, data: DraggableData) => {
        setDraggablePosition({
            x: data.x,
            y: data.y,
        });
    }, []);

    const handleStopDrag = useCallback(
        (e: DraggableEvent, data: DraggableData) => {
            setDraggablePosition({
                x: data.x,
                y: data.y,
            });

            const leftPercentage = roundNumberToPrecision(
                (data.x + (contentRef.current?.clientWidth ?? 0) / 2) / width,
                2,
            );

            const topPercentage = roundNumberToPrecision(
                (data.y + (contentRef.current?.clientHeight ?? 0) / 2) / height,
                2,
            );

            setValue(`templateLinks[${index}].top`, topPercentage);
            setValue(`templateLinks[${index}].left`, leftPercentage);
        },
        [linkData.id, width, height],
    );

    const handleAcceptLink = useCallback(
        async (event: React.MouseEvent<unknown>) => {
            event.stopPropagation();
            const isValid = await trigger(`templateLinks`);

            if (isValid) {
                handleSetElementInActive();
            } else {
                addNotificationEvent({
                    message: 'errors.invalidUrl',
                    withErrorIcon: true,
                    type: NotificationType.validationError,
                });
            }
        },
        [],
    );

    const handleRemoveLink = useCallback(
        (event: React.MouseEvent<unknown>) => {
            event.stopPropagation();
            onRemove?.(index);
        },
        [onRemove, index],
    );

    const [currentAccordionId, setCurrentAccordionId] = useState(
        linkData.type === 'add'
            ? `accord-tooltip-${linkData.key ?? linkData?.id}`
            : '',
    );

    const handleChangeAccordion = useCallback((accordionId: string) => {
        setCurrentAccordionId(prev =>
            prev === accordionId ? '' : accordionId,
        );
    }, []);

    const renderTooltip = () => {
        return (
            <CustomAccordion
                currentAccordionId={currentAccordionId}
                accordionId={`accord-tooltip-${linkData.key ?? linkData?.id}`}
                onChange={handleChangeAccordion}
                label={titleRef.current?.value || ''}
                typographyVariant="h5"
                variant="base"
                AccordionSummaryIcon={
                    <RoundArrowIcon
                        width="25px"
                        height="25px"
                        className={styles.arrowIcon}
                    />
                }
                className={styles.accordion}
                typographyProps={{
                    fontSize: 18,
                    color: 'colors.white.primary',
                }}
            >
                <CustomGrid
                    container
                    direction="column"
                    wrap="nowrap"
                    gap={2}
                    className={styles.tooltipContent}
                >
                    <CustomGrid container direction="column" gap={1}>
                        <CustomTypography
                            variant="body3"
                            color="colors.white.primary"
                            className={styles.label}
                        >
                            <Translation
                                nameSpace="createRoom"
                                translation="templateLinks.form.title"
                            />
                        </CustomTypography>
                        <CustomInput
                            multiline
                            autoComplete="off"
                            color="secondary"
                            minRows={1}
                            classes={{
                                root: styles.inputWrapper,
                            }}
                            InputProps={{
                                classes: {
                                    input: styles.textArea,
                                    root: styles.inputRoot,
                                },
                            }}
                            placeholder="Type a title for link"
                            onFocus={handleSetElementActive}
                            {...registerTitleData}
                            ref={e => {
                                refTitleData(e);
                                titleRef.current = e;
                            }}
                        />
                    </CustomGrid>

                    <CustomGrid>
                        {isStatic ? (
                            <CustomTypography
                                className={styles.staticLink}
                                color="colors.white.primary"
                            >
                                {linkData.value}
                            </CustomTypography>
                        ) : (
                            <CustomGrid
                                container
                                flexDirection="column"
                                gap={1}
                            >
                                <CustomTypography
                                    variant="body3"
                                    color="colors.white.primary"
                                    className={styles.label}
                                >
                                    <Translation
                                        nameSpace="createRoom"
                                        translation="templateLinks.form.link"
                                    />
                                </CustomTypography>
                                <CustomInput
                                    multiline
                                    autoComplete="off"
                                    color="secondary"
                                    inputProps={{
                                        cols: '25',
                                    }}
                                    minRows={1}
                                    maxRows={4}
                                    classes={{
                                        root: styles.inputWrapper,
                                    }}
                                    // eslint-disable-next-line react/jsx-no-duplicate-props
                                    InputProps={{
                                        classes: {
                                            input: styles.textArea,
                                            root: styles.inputRoot,
                                        },
                                    }}
                                    placeholder="Enter link & drag to place"
                                    onFocus={handleSetElementActive}
                                    {...registerData}
                                />
                            </CustomGrid>
                        )}
                    </CustomGrid>
                    <CustomGrid
                        container
                        direction="row"
                        justifyContent="center"
                        gap={1}
                    >
                        {isActive && !isStatic ? (
                            <RoundSuccessIcon
                                className={styles.acceptIcon}
                                onClick={handleAcceptLink}
                                width="24px"
                                height="24px"
                            />
                        ) : null}
                        {!isStatic && (
                            <RoundErrorIcon
                                className={styles.rejectIcon}
                                onClick={handleRemoveLink}
                                width="24px"
                                height="24px"
                            />
                        )}
                    </CustomGrid>
                </CustomGrid>
            </CustomAccordion>
        );
    };

    return (
        <Draggable
            disabled={!isDraggable}
            position={draggablePosition}
            onDrag={handleDrag}
            onStop={handleStopDrag}
            nodeRef={contentRef}
            defaultClassName={styles.draggable}
        >
            <CustomTooltip
                open
                placement="bottom"
                arrow
                tooltipClassName={styles.itemTooltip}
                title={renderTooltip()}
            >
                <CustomBox
                    justifyContent="center"
                    display="flex"
                    alignItems="center"
                    ref={contentRef}
                    className={styles.linkItem}
                >
                    <CustomBox marginTop="4px">
                        <CustomImage
                            width={20}
                            height={20}
                            src="/images/link.png"
                        />
                    </CustomBox>
                </CustomBox>
            </CustomTooltip>
        </Draggable>
    );
};

export const TemplateLinkItem = memo(Component);
