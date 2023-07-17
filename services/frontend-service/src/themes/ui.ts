import { alpha, Theme, createTheme } from '@mui/material';

export const uiTheme = (theme: Theme) =>
    createTheme({
        ...theme,
        background: {
            default: '#E6F2FA',
            old: '#F4F6F9',
        },
        borderColor: {
            primary: theme.designSystemColors.grayscale.normal,
            focused: theme.designSystemColors.black.primary,
        },
        borderRadius: {
            small: '5px',
            medium: '10px',
        },
        palette: {
            primary: {
                main: theme.designSystemColors.orange.primary,
                darker: theme.designSystemColors.orange.dark,
            },
            secondary: {
                main: theme.designSystemColors.grayscale.normal,
                darker: theme.designSystemColors.grayscale.dark,
            },
            disabled: {
                main: alpha(theme.designSystemColors.grayscale.normal, 0.4),
                darker: alpha(theme.designSystemColors.grayscale.dark, 0.4),
            },
            colors: theme.designSystemColors,
            buttons: {
                primary: {
                    main: theme.designSystemColors.orange.primary,
                    hover: theme.designSystemColors.orange.dark,
                    disabled: alpha(theme.palette.common.black, 0.12),
                },
                cancel: {
                    main: alpha(
                        theme.designSystemColors.grayscale.normal,
                        0.25,
                    ),
                    hover: alpha(
                        theme.designSystemColors.grayscale.normal,
                        0.4,
                    ),
                    disabled: alpha(theme.palette.common.black, 0.4),
                },
                gray: {
                    main: alpha(theme.designSystemColors.black.primary, 0.6),
                    hover: alpha(theme.designSystemColors.black.primary, 0.75),
                    disabled: alpha(
                        theme.designSystemColors.black.primary,
                        0.2,
                    ),
                },
            },
            success: {
                main: theme.designSystemColors.green.primary,
            },
            error: {
                main: theme.designSystemColors.red.primary,
            },
            text: {
                primary: theme.designSystemColors.black.primary,
                secondary: theme.designSystemColors.white.dark,
            },
            stroke: {
                primary: alpha(theme.designSystemColors.grayscale.normal, 0.4),
                hover: alpha(theme.designSystemColors.black.primary, 0.2),
                active: theme.designSystemColors.black.primary,
                error: theme.designSystemColors.red.primary,
            },
            shadow: {
                primary: theme.designSystemColors.black.primary,
                light: alpha(theme.designSystemColors.black.primary, 0.06),
                normal: alpha(theme.designSystemColors.black.primary, 0.1),
                hover: alpha(theme.designSystemColors.black.primary, 0.24),
                contrast: alpha(theme.designSystemColors.black.primary, 0.64),
            },
        },
    });
