import React, {memo, useCallback, useLayoutEffect, useMemo, useRef, useState} from "react";
import Draggable, {
    ControlPosition,
    DraggableData,
    DraggableEvent,
} from 'react-draggable';
import {useStore} from "effector-react";
import {useFormContext} from "react-hook-form";
import InputBase from "@mui/material/InputBase";

import {useToggle} from "shared-frontend/hooks/useToggle";
import {CustomGrid} from "shared-frontend/library/custom/CustomGrid";
import {CustomBox} from "shared-frontend/library/custom/CustomBox";
import {CustomTooltip} from "shared-frontend/library/custom/CustomTooltip";
import { RoundErrorIcon } from 'shared-frontend/icons/RoundIcons/RoundErrorIcon';
import {RoundSuccessIcon} from "shared-frontend/icons/RoundIcons/RoundSuccessIcon";

import styles from './TemplateLinks.module.scss';

import {$windowSizeStore} from "../../../store";

import {TemplateLinkItemProps} from "./TemplateLinks.types";
import {CustomTypography} from "shared-frontend/library/custom/CustomTypography";

const Component = ({
   index,
   isDraggable = false,
    isStatic = false,
   data,
   onPositionChange,
   onRemove,
   onAccept,
}: TemplateLinkItemProps) => {
    const {
        width,
        height
    } = useStore($windowSizeStore);

    const {
        register,
    } = useFormContext();

    const {
        value: isActive,
        onSwitchOn: handleSetElementActive,
        onSwitchOff: handleSetElementInActive,
    } = useToggle(false);

    const inputKey = `templateLinks[${index}].value`;

    const registerData = useMemo(() => register(inputKey), [inputKey]);

    const [draggablePosition, setDraggablePosition] = useState<ControlPosition>(
        {
            x: 0,
            y: 0,
        },
    );

    const contentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const xPosition =
            width * data.left - (contentRef.current?.clientWidth ?? 0) / 2;
        const yPosition =
            height * data.top - (contentRef.current?.clientHeight ?? 0) / 2;

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
            const leftPercentage =
                Math.round(
                    ((data.x + (contentRef.current?.clientWidth ?? 0) / 2) /
                        width) *
                    10000,
                ) / 100;
            const topPercentage =
                Math.round(
                    ((data.y + (contentRef.current?.clientHeight ?? 0) / 2) /
                        height) *
                    10000,
                ) / 100;
            onPositionChange?.({
                id: data.id,
                left: leftPercentage,
                top: topPercentage,
            });
        },
        [data.id, width, height, onPositionChange],
    );

    const handleAcceptLink = (event: React.MouseEvent<unknown>) => {
        event.stopPropagation();
        handleSetElementInActive();
        onAccept?.(index);
    }

    const handleRemoveLink = (event: React.MouseEvent<unknown>) => {
        event.stopPropagation()
        onRemove?.(index)
    }

    const handleBlur = (event: React.FocusEvent<Element | HTMLInputElement | HTMLTextAreaElement, Element>) => {
        handleSetElementInActive()
        registerData.onBlur(event);
    }

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
                title={(
                    <CustomGrid container wrap="nowrap" gap={1} className={styles.tooltipContent}>
                        {isStatic
                            ? (
                                <CustomTypography color="colors.white.primary">
                                    {data.value}
                                </CustomTypography>
                            )
                            : (
                                <InputBase
                                    multiline
                                    inputProps={{
                                        cols: "25"
                                    }}
                                    minRows={1}
                                    maxRows={4}
                                    classes={{
                                        root: styles.inputWrapper,
                                    }}
                                    placeholder="Your link here"
                                    onFocus={handleSetElementActive}
                                    {...registerData}
                                    onBlur={handleBlur}
                                />
                            )
                        }
                        {isActive && !isStatic
                            ? (
                                <RoundSuccessIcon
                                    className={styles.acceptIcon}
                                    onClick={handleAcceptLink}
                                    width="24px"
                                    height="24px"
                                />
                            )
                            : null
                        }
                        {!isStatic && (
                            <RoundErrorIcon
                                className={styles.rejectIcon}
                                onMouseDown={handleRemoveLink}
                                width="24px"
                                height="24px"
                            />
                        )}
                    </CustomGrid>
                )}
            >
                <CustomBox
                    ref={contentRef}
                    className={styles.linkItem}
                >
                    {' '}
                </CustomBox>
            </CustomTooltip>
        </Draggable>
    );
}

export const TemplateLinkItem = memo(Component);