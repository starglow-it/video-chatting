import React, {
	memo 
} from 'react';

// components
import {TagItem} from "../TagItem";
import {CustomTypography} from "../../custom/CustomTypography";

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
	<TagItem
		className={className}
		label={(
			<CustomTypography
				className={styles.tagText}
				variant={typographyVariant}
				color={category.color}
			>
				{category.value}
			</CustomTypography>
		)}
	/>
);

const BusinessCategoryItem = memo(Component);

export default BusinessCategoryItem;