import { TypographyProps } from '@mui/material';

export type CustomTypographyProps = TypographyProps & {
    transform?: 'capitalize' | 'uppercase' | 'lowercase';
};
