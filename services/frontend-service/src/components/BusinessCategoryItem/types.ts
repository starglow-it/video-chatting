import { TypographyVariant } from '@mui/material';
import { BusinessCategory } from '../../store/types';

export type BusinessCategoryItemProps = {
    category: BusinessCategory;
    className?: string;
    typographyVariant?: TypographyVariant;
};
