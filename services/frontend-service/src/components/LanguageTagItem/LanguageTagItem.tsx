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
	LanguageTagItemProps 
} from './types';

const Component = ({
	className, 
	language 
}: LanguageTagItemProps) => (
	<TagItem className={className}>
		<CustomTypography>{language?.value}</CustomTypography>
	</TagItem>
);

export const LanguageTagItem = memo(Component);
