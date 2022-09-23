import React, { memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Draggable, { ControlPosition, DraggableData, DraggableEvent } from 'react-draggable';
import { useStore } from 'effector-react';

// hooks
import { useToggle } from '@hooks/useToggle';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomTooltip } from '@library/custom/CustomTooltip/CustomTooltip';

// types
import { UserVideoStubProps } from '@components/CreateRoom/EditAttendeesPosition/UserVideoStub/types';

// icons
import { PersonIcon } from '@library/icons/PersonIcon';
import { MicIcon } from '@library/icons/MicIcon';

// store
import { $windowSizeStore } from '../../../../store';

// styles
import styles from './UserVideoStub.module.scss';

const Component = ({ stubId, index, position, onPositionChange }: UserVideoStubProps) => {
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
            const leftPercentage = Math.round(
                (data.x / (width - (contentRef.current?.clientWidth ?? 0))) * 100,
            );
            const topPercentage = Math.round(
                (data.y / (height - (contentRef.current?.clientHeight ?? 0))) * 100,
            );
            onPositionChange({ id: stubId, left: leftPercentage, top: topPercentage });
            onStopDrag();
        },
        [stubId, width, height],
    );

    useLayoutEffect(() => {
        setDraggablePosition({
            x: (width / 100) * position.left - (contentRef.current?.clientWidth ?? 0) / 2,
            y: (height / 100) * position.top - (contentRef.current?.clientHeight ?? 0) / 2,
        });
    }, []);

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
                className={styles.wrapper}
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
                    open={shouldShowTooltip && !isDragging}
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
