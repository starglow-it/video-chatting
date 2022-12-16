import React, {
	memo, useEffect 
} from 'react';
import {
	useStore 
} from 'effector-react';

// shared
import {
	CustomLoader
} from 'shared-frontend/library/custom/CustomLoader';
import {
	CustomTypography 
} from 'shared-frontend/library/custom/CustomTypography';
import {
	CustomGrid 
} from 'shared-frontend/library/custom/CustomGrid';
import {
	StatisticsIcon 
} from 'shared-frontend/icons/OtherIcons/StatisticsIcon';

// components
import {
	Translation 
} from '@components/Translation/Translation';

// stores
import {
	$userProfileIdStore,
	$userProfileStatisticStore,
	getUserProfileStatisticFx,
} from '../../../store';

// styles
import styles from './UserProfileStatistic.module.scss';

const Component = () => {
	const {
		state: userStatistic 
	} = useStore($userProfileStatisticStore);
	const {
		state: activeUserId 
	} = useStore($userProfileIdStore);
	const isGetUserProfileStatisticsPending = useStore(
		getUserProfileStatisticFx.pending,
	);

	useEffect(() => {
		if (activeUserId) {
			getUserProfileStatisticFx({
				userId: activeUserId,
			});
		}
	}, [activeUserId]);

	if (isGetUserProfileStatisticsPending) {
		return <CustomLoader className={styles.loader} />;
	}

	return (
		<CustomGrid
			display="grid"
			gridTemplateColumns="200px 200px"
			gridTemplateRows="repeat(4, min-content)"
		>
			<CustomGrid
				container
				gridArea="1/1/1/1"
				className={styles.title}
			>
				<StatisticsIcon
					className={styles.personIcon}
					width="24px"
					height="24px"
				/>
				<CustomTypography
					variant="body1"
					fontWeight="600"
				>
					<Translation
						nameSpace="profile"
						translation="statistics.title"
					/>
				</CustomTypography>
			</CustomGrid>
			<CustomTypography
				gridArea="2/1/2/1"
				variant="body2"
				color="colors.grayscale.normal"
			>
				<Translation
					nameSpace="profile"
					translation="statistics.minutesSpent"
				/>
			</CustomTypography>
			<CustomTypography
				gridArea="3/1/3/1"
				variant="body2"
				color="colors.grayscale.normal"
			>
				<Translation
					nameSpace="profile"
					translation="statistics.roomsUsed"
				/>
			</CustomTypography>
			<CustomTypography
				gridArea="4/1/4/1"
				variant="body2"
				color="colors.grayscale.normal"
			>
				<Translation
					nameSpace="profile"
					translation="statistics.moneyEarned"
				/>
			</CustomTypography>
			<CustomTypography
				gridArea="2/2/2/2"
				variant="body2"
			>
				{Math.floor(userStatistic?.minutesSpent ? (userStatistic?.minutesSpent / 1000 / 60) : 0)}
			</CustomTypography>
			<CustomTypography
				gridArea="3/2/3/2"
				variant="body2"
			>
				{userStatistic?.roomsUsed ?? 0}
			</CustomTypography>
			<CustomTypography
				gridArea="4/2/4/2"
				variant="body2"
			>
				{userStatistic?.moneyEarned ?? 0}
			</CustomTypography>
		</CustomGrid>
	);
};

export const UserProfileStatistic = memo(Component);
