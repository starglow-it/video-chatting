import { createTheme } from '@mui/material/styles';
import { alpha, Theme } from '@mui/material';

export const uiTheme = (theme: Theme) =>
    createTheme({
        ...theme,
        background: {
            default: '#F4F6F9',
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
            colors: theme.designSystemColors,
            buttons: {
                primary: {
                    main: theme.designSystemColors.orange.primary,
                    hover: theme.designSystemColors.orange.dark,
                    disabled: alpha(theme.palette.common.black, 0.12),
                },
                cancel: {
                    main: alpha(theme.designSystemColors.grayscale.normal, 0.25),
                    hover: alpha(theme.designSystemColors.grayscale.normal, 0.4),
                    disabled: alpha(theme.palette.common.black, 0.4),
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
