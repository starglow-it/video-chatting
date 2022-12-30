import {
	memo, useCallback, useLayoutEffect, useRef, useState 
} from 'react';
import Draggable, {
	ControlPosition,
	DraggableData,
	DraggableEvent,
} from 'react-draggable';
import { useStore } from 'effector-react';
import clsx from 'clsx';

import { roundNumberToPrecision } from 'shared-utils';

// custom
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTooltip } from 'shared-frontend/library/custom/CustomTooltip';

import { useToggle } from 'shared-frontend/hooks/useToggle';

// icons
import { MicIcon } from 'shared-frontend/icons/OtherIcons/MicIcon';
import { PersonIcon } from 'shared-frontend/icons/OtherIcons/PersonIcon';

import { Translation } from '@components/Translation/Translation';

// types
import { UserVideoStubProps } from './types';

// store
import { $windowSizeStore } from '../../../store';

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

	const {
		width, height 
	} = useStore($windowSizeStore);

	const [draggablePosition, setDraggablePosition] = useState<ControlPosition>(
		{
			x: 0,
			y: 0,
		},
	);

	const contentRef = useRef<HTMLDivElement>(null);

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

			onPositionChange?.({
				id: stubId,
				left: leftPercentage,
				top: topPercentage,
			});
			onStopDrag();
		},
		[stubId, width, height, onPositionChange],
	);

	useLayoutEffect(() => {
		const xPosition =
            width * position.left - (contentRef.current?.clientWidth ?? 0) / 2;
		const yPosition =
            height * position.top - (contentRef.current?.clientHeight ?? 0) / 2;

		setDraggablePosition({
			x: xPosition,
			y: yPosition,
		});
	}, [width, height]);

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
				className={clsx(styles.wrapper, {
					[styles.disabled]: !isDraggable,
				})}
			>
				<CustomGrid
					container
					className={styles.avatarStub}
					alignItems="center"
					justifyContent="center"
				>
					<PersonIcon
						width="60px"
						height="60px"
						className={styles.icon}
					/>
				</CustomGrid>
				<CustomTooltip
					arrow
					placement="bottom"
					open={isDraggable && shouldShowTooltip && !isDragging}
					title={
						<CustomTypography variant="body2">
							<Translation
								nameSpace="rooms"
								translation="editPositions.tooltip"
							/>
						</CustomTypography>
					}
					classes={{
						tooltip: styles.tooltip,
					}}
				>
					<CustomPaper
						variant="black-glass"
						className={styles.paper}
					>
						<CustomGrid
							container
							alignItems="center"
							gap={0.25}
						>
							<MicIcon
								isActive
								width="16px"
								height="16px"
							/>
							<CustomTypography
								variant="body3"
								color="colors.white.primary"
							>
								<Translation
									nameSpace="rooms"
									translation="editPositions.user"
									options={{
										index: index + 1,
									}}
								/>
							</CustomTypography>
						</CustomGrid>
					</CustomPaper>
				</CustomTooltip>
			</CustomGrid>
		</Draggable>
	);
};

export const UserVideoStub = memo(Component);
