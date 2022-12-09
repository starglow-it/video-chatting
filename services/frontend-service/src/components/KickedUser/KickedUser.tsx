import React, {
	memo 
} from 'react';

// icon
import {
	WarningIcon 
} from 'shared-frontend/icons/OtherIcons/WarningIcon';

// custom
import {
	CustomGrid 
} from 'shared-frontend/library/custom/CustomGrid';
import {
	CustomTypography 
} from '@library/custom/CustomTypography/CustomTypography';

// styles
import styles from './KickedUser.module.scss';

const Component = () => (
	<CustomGrid
		direction="column"
		container
		alignItems="center"
		justifyContent="center"
	>
		<CustomGrid
			container
			alignItems="center"
			justifyContent="center"
		>
			<WarningIcon
				width="36px"
				height="36px"
				className={styles.icon}
			/>
			<CustomTypography
				variant="h3bold"
				nameSpace="meeting"
				translation="over"
			/>
		</CustomGrid>
		<CustomTypography
			className={styles.text}
			nameSpace="meeting"
			translation="kicked"
		/>
	</CustomGrid>
);

export const KickedUser = memo(Component);
