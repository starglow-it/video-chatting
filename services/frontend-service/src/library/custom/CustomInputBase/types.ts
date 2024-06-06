import { TranslationProps } from '@library/common/Translation/types';
import { TextFieldProps } from '@mui/material/TextField/TextField';

export type CustomInputProps = { error?: string } & Partial<TranslationProps> &
    Omit<TextFieldProps, 'error'>;
