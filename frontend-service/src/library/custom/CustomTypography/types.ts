import { TypographyProps } from '@mui/material';
import { TranslationProps } from '@library/common/Translation/types';

export type CustomTypographyProps =
    TypographyProps &
    TranslationProps &
    {
        transform?: 'capitalize' | 'uppercase' | 'lowercase';
    };
