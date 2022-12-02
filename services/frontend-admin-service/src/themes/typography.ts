import { Theme } from '@mui/material';
import createTheme from '@mui/material/styles/createTheme';

export const typographyTheme = (theme: Theme) =>
    createTheme({
        ...theme,
        typography: {
            ...theme.typography,
            fontFamily: ['"Poppins"', 'sans-serif'].join(','),
            body1: {
                fontSize: theme.typography.pxToRem(16),
                lineHeight: theme.typography.pxToRem(24),
            },
            body1bold: {
                fontSize: theme.typography.pxToRem(16),
                lineHeight: theme.typography.pxToRem(24),
                fontWeight: 600,
            },
            body2: {
                fontSize: theme.typography.pxToRem(14),
                lineHeight: theme.typography.pxToRem(22),
            },
            body2bold: {
                fontSize: theme.typography.pxToRem(14),
                lineHeight: theme.typography.pxToRem(22),
                fontWeight: 600,
            },
            body3: {
                fontSize: theme.typography.pxToRem(12),
                lineHeight: theme.typography.pxToRem(18),
            },
            body3bold: {
                fontSize: theme.typography.pxToRem(12),
                lineHeight: theme.typography.pxToRem(18),
                fontWeight: 600,
            },
            h4: {
                fontSize: theme.typography.pxToRem(20),
                lineHeight: theme.typography.pxToRem(30),
            },
            h4bold: {
                fontSize: theme.typography.pxToRem(20),
                lineHeight: theme.typography.pxToRem(30),
                fontWeight: 600,
            },
            h3: {
                fontSize: theme.typography.pxToRem(24),
                lineHeight: theme.typography.pxToRem(36),
            },
            h3bold: {
                fontSize: theme.typography.pxToRem(24),
                lineHeight: theme.typography.pxToRem(36),
                fontWeight: 600,
            },
            h2: {
                fontWeight: 600,
                fontSize: theme.typography.pxToRem(24),
                lineHeight: theme.typography.pxToRem(36),
            },
            h2bold: {
                fontSize: theme.typography.pxToRem(28),
                lineHeight: theme.typography.pxToRem(40),
                fontWeight: 600,
            },
            h1: {
                fontWeight: 600,
                fontSize: theme.typography.pxToRem(38),
                lineHeight: theme.typography.pxToRem(58),
            },
        },
    });
