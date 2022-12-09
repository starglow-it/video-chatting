import { TextFieldProps } from '@mui/material/TextField/TextField';

export type CustomInputProps = { error?: string } &
    Omit<TextFieldProps, 'error'>;
