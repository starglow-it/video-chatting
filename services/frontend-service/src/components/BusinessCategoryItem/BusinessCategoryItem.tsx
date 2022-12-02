import React, {
	memo 
} from 'react';

// custom
import {
	CustomTypography 
} from '@library/custom/CustomTypography/CustomTypography';

// common
import {
	TagItem 
} from '@library/common/TagItem/TagItem';

// types
import {
	BusinessCategoryItemProps 
} from './types';

// styles
import styles from './BusinessCategoryItem.module.scss';

const Component = ({
	category,
	className,
	typographyVariant,
}: BusinessCategoryItemProps) => (
	<TagItem className={className}>
		<CustomTypography
			className={styles.tagText}
			variant={typographyVariant}
			color={category.color}
		>
			{category.value}
		</CustomTypography>
	</TagItem>
);

export const BusinessCategoryItem = memo(Component);
