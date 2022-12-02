import {
	TypographyVariant 
} from '@mui/material';
import {
	IBusinessCategory 
} from 'shared-types';

export type BusinessCategoryItemProps = {
    category: IBusinessCategory;
    className?: string;
    typographyVariant?: TypographyVariant;
};
