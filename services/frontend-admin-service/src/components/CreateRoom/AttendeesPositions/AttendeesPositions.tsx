import {
	memo, useCallback, useMemo 
} from 'react';
import {
	useFormContext, useWatch 
} from 'react-hook-form';

// shared
import { ArrowRightIcon } from 'shared-frontend/icons/OtherIcons/ArrowRightIcon';
import { ArrowLeftIcon } from 'shared-frontend/icons/OtherIcons/ArrowLeftIcon';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';

// components
import { Translation } from '@components/Translation/Translation';
import { UserVideoStub } from '@components/CreateRoom/UserVideoStub/UserVideoStub';

import { ParticipantPosition } from 'shared-frontend/types';
import { AttendeesPositionsProps } from './AttendeesPositions.types';

import styles from './AttendeesPositions.module.scss';

const Component = ({
	onPreviousStep, onNextStep 
}: AttendeesPositionsProps) => {
	const {
		control, setValue 
	} = useFormContext();

	const participantsPositions = useWatch({
		control,
		name: 'participantsPositions',
	});
	const participantsNumber = useWatch({
		control,
		name: 'participantsNumber',
	});

	const handleChangePosition = useCallback(
		({
			id, top, left 
		}: ParticipantPosition) => {
			const positionIndex = participantsPositions.findIndex(
				({
					id: stubId 
				}) => stubId === id,
			);
			if (positionIndex === -1) {
				return;
			}

			const copy = [...participantsPositions];
			copy[positionIndex] = {
				id,
				top,
				left,
			};
			setValue('participantsPositions', copy);
		},
		[participantsPositions],
	);

	const stubs = useMemo(
		() =>
			participantsPositions.map(
				({
					id, top, left 
				}: ParticipantPosition, index: number) => (
					<UserVideoStub
						key={id}
						stubId={id}
						index={index}
						position={{
							top,
							left,
						}}
						onPositionChange={handleChangePosition}
					/>
				),
			),
		[participantsPositions],
	);

	return (
		<CustomGrid
			container
			className={styles.wrapper}
		>
			<CustomPaper
				variant="black-glass"
				className={styles.paper}
			>
				<CustomTypography
					variant="body2"
					color="colors.white.primary"
				>
					<Translation
						nameSpace="rooms"
						translation="editPositions.attendees"
						options={{
							number: participantsNumber,
						}}
					/>
				</CustomTypography>
			</CustomPaper>
			{stubs}
			<CustomGrid
				container
				gap={1.5}
				flexWrap="nowrap"
				justifyContent="center"
				className={styles.buttonsGroup}
			>
				<ActionButton
					variant="gray"
					Icon={<ArrowLeftIcon
						width="32px"
						height="32px"
					      />}
					className={styles.actionButton}
					onAction={onPreviousStep}
				/>
				<ActionButton
					variant="accept"
					Icon={<ArrowRightIcon
						width="32px"
						height="32px"
					      />}
					className={styles.actionButton}
					onAction={onNextStep}
				/>
			</CustomGrid>
		</CustomGrid>
	);
};

export const AttendeesPositions = memo(Component);
