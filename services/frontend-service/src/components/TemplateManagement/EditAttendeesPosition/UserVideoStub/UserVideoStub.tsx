import React, { memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Draggable, { ControlPosition, DraggableData, DraggableEvent } from 'react-draggable';
import { useStore } from 'effector-react';
import clsx from 'clsx';

// hooks
import { useToggle } from '@hooks/useToggle';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

// types
import { UserVideoStubProps } from '@components/TemplateManagement/EditAttendeesPosition/UserVideoStub/types';

// icons
import { PersonIcon } from '@library/icons/PersonIcon';
import { MicIcon } from '@library/icons/MicIcon';

// store
import { $windowSizeStore } from '../../../../store';

// styles
import styles from './UserVideoStub.module.scss';

const Component = ({
    stubId,
    index,
    position,
    isDraggable = true,
    onPositionChange,
}: UserVideoStubProps) => {
    const {
        value: isDragging,
        onSwitchOn: onStartDrag,
        onSwitchOff: onStopDrag,
    } = useToggle(false);

    const {
        value: shouldShowTooltip,
        onSwitchOn: onShowTooltip,
        onSwitchOff: onHideTooltip,
    } = useToggle(false);

    const { width, height } = useStore($windowSizeStore);

    const [draggablePosition, setDraggablePosition] = useState<ControlPosition>({ x: 0, y: 0 });

    const contentRef = useRef<HTMLDivElement>(null);

    const handleDrag = useCallback((e: DraggableEvent, data: DraggableData) => {
        setDraggablePosition({ x: data.x, y: data.y });
    }, []);

    const handleStopDrag = useCallback(
        (e: DraggableEvent, data: DraggableData) => {
            setDraggablePosition({ x: data.x, y: data.y });
            const leftPercentage =
                Math.round(
                    ((data.x + (contentRef.current?.clientWidth ?? 0) / 2) / width) * 10000,
                ) / 100;
            const topPercentage =
                Math.round(
                    ((data.y + (contentRef.current?.clientHeight ?? 0) / 2) / height) * 10000,
                ) / 100;
            onPositionChange?.({ id: stubId, left: leftPercentage, top: topPercentage });
            onStopDrag();
        },
        [stubId, width, height, onPositionChange],
    );

    useLayoutEffect(() => {
        const xPosition = width * position.left - (contentRef.current?.clientWidth ?? 0) / 2;
        const yPosition = height * position.top - (contentRef.current?.clientHeight ?? 0) / 2;

        setDraggablePosition({
            x: xPosition,
            y: yPosition,
        });
    }, [width, height]);

    const tooltipTitle = useMemo(
        () => (
            <CustomTypography
                variant="body2"
                nameSpace="createRoom"
                translation="editPositions.tooltip"
            />
        ),
        [],
    );

    return (
        <Draggable
            disabled={!isDraggable}
            position={draggablePosition}
            onDrag={handleDrag}
            onStart={onStartDrag}
            onStop={handleStopDrag}
            nodeRef={contentRef}
            defaultClassName={styles.draggable}
        >
            <CustomGrid
                container
                direction="column"
                width="fit-content"
                ref={contentRef}
                alignItems="center"
                gap={1.625}
                onMouseEnter={onShowTooltip}
                onMouseLeave={onHideTooltip}
                className={clsx(styles.wrapper, { [styles.disabled]: !isDraggable })}
            >
                <CustomGrid
                    container
                    className={styles.avatarStub}
                    alignItems="center"
                    justifyContent="center"
                >
                    <PersonIcon width="60px" height="60px" className={styles.icon} />
                </CustomGrid>
                <CustomTooltip
                    arrow
                    placement="bottom"
                    open={isDraggable && shouldShowTooltip && !isDragging}
                    title={tooltipTitle}
                    classes={{
                        tooltip: styles.tooltip,
                    }}
                >
                    <CustomPaper variant="black-glass" className={styles.paper}>
                        <CustomGrid container alignItems="center" gap={0.25}>
                            <MicIcon isActive width="16px" height="16px" />
                            <CustomTypography
                                variant="body3"
                                color="colors.white.primary"
                                nameSpace="createRoom"
                                translation="editPositions.user"
                                options={{ index: index + 1 }}
                            />
                        </CustomGrid>
                    </CustomPaper>
                </CustomTooltip>
            </CustomGrid>
        </Draggable>
    );
};

export const UserVideoStub = memo(Component);
