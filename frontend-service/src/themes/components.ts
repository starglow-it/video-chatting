import { alpha, Theme, createTheme } from '@mui/material';

export const componentsTheme = (theme: Theme) =>
    createTheme({
        ...theme,
        components: {
            MuiSnackbarContent: {
                styleOverrides: {
                    root: {
                        background: alpha(theme.palette.common.black, 0.6),
                        borderRadius: '6px',
                        minWidth: 'auto',
                        padding: '5px 12px',
                        '@media (min-width: 600px)': {
                            minWidth: 'auto',
                        },
                    },
                    message: {
                        margin: '0 auto',
                        padding: 0,
                        fontSize: theme.typography.pxToRem(14),
                        lineHeight: theme.typography.pxToRem(22),
                    },
                },
            },
            MuiSelect: {
                styleOverrides: {
                    icon: {
                        right: '10px',
                    },
                    select: {
                        maxWidth: '90%',
                        lineHeight: '32px',
                    },
                },
            },
            MuiList: {
                styleOverrides: {
                    root: {
                        '&.MuiMenu-list': {
                            padding: '5px !important',
                        },
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        position: 'relative',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'block',
                        borderRadius: '4px',
                        padding: '12px',

                        '&:hover': {
                            background: alpha(theme.designSystemColors.grayscale.normal, 0.25),
                        },
                        '&.Mui-selected': {
                            color: theme.designSystemColors.orange.primary,
                            background: 'transparent',
                            '&:after': {
                                content: "''",
                                width: '24px',
                                height: '24px',
                                position: 'absolute',
                                right: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: "url('/images/check-icon.svg')",
                            },
                            '&:hover': {
                                background: alpha(theme.designSystemColors.grayscale.normal, 0.25),
                            },
                        },
                    },
                },
            },
            MuiSlider: {
                styleOverrides: {
                    root: {
                        '& .MuiSlider-rail': {
                            backgroundColor: alpha(theme.designSystemColors.grayscale.normal, 0.4),
                            opacity: 1,
                        },
                        '& .MuiSlider-thumb': {
                            width: '24px',
                            height: '24px',
                            backgroundColor: theme.designSystemColors.white.primary,
                            border: '3px solid currentColor',
                        },
                    },
                },
            },
            MuiRadio: {
                styleOverrides: {
                    root: {
                        color: alpha(theme.designSystemColors.grayscale.normal, 0.6),
                        '&.Mui-checked': {
                            color: theme.designSystemColors.orange.primary,
                        },
                    },
                },
            },
            MuiDialogActions: {
                styleOverrides: {
                    root: {
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        cursor: 'pointer',
                    },
                },
            },
            MuiButton: {
                variants: [
                    {
                        props: { variant: 'custom-cancel' },
                        style: {
                            background: theme.palette.buttons.cancel.main,
                            color: theme.palette.common.black,
                            '&:hover': {
                                background: alpha(theme.palette.buttons.cancel.hover, 0.4),
                            },
                            '&.Mui-disabled': {
                                background: theme.palette.buttons.cancel.disabled,
                            },
                        },
                    },
                    {
                        props: { variant: 'custom-danger' },
                        style: {
                            background: theme.designSystemColors.red.primary,
                            color: theme.palette.common.white,
                            '&:hover': {
                                background: alpha(theme.designSystemColors.red.primary, 0.6),
                            },
                            '&.Mui-disabled': {
                                background: theme.palette.buttons.cancel.disabled,
                            },
                        },
                    },
                    {
                        props: { variant: 'custom-common' },
                        style: {
                            background: theme.palette.common.white,
                            color: theme.palette.common.black,
                            border: `1px solid ${alpha(
                                theme.designSystemColors.grayscale.normal,
                                0.4,
                            )}`,
                            '&:hover': {
                                background: alpha(theme.designSystemColors.grayscale.normal, 0.4),
                            },
                            '&.Mui-disabled': {
                                background: theme.palette.buttons.cancel.disabled,
                            },
                        },
                    },
                    {
                        props: { variant: 'custom-primary' },
                        style: {
                            background: theme.palette.buttons.primary.main,
                            color: theme.palette.common.white,
                            '&:hover': {
                                background: theme.palette.buttons.primary.hover,
                            },
                            '&.Mui-disabled': {
                                background: theme.palette.buttons.primary.disabled,
                            },
                        },
                    },
                    {
                        props: { variant: 'custom-error' },
                        style: {
                            background: theme.designSystemColors.red.primary,
                            color: theme.palette.common.white,
                            '&:hover': {
                                background: theme.designSystemColors.red.dark,
                            },
                            '&.Mui-disabled': {
                                background: theme.palette.buttons.primary.disabled,
                            },
                        },
                    },
                    {
                        props: { variant: 'custom-transparent' },
                        style: {
                            background: 'transparent',
                            color: theme.palette.common.white,
                            border: `1px solid ${theme.palette.common.white}`,
                            '&:hover': {
                                background: theme.palette.common.white,
                                color: theme.palette.common.black,
                            },
                        },
                    },
                    {
                        props: { variant: 'custom-black' },
                        style: {
                            background: theme.palette.common.black,
                            color: theme.palette.common.white,
                            '&:hover': {
                                background: alpha(theme.palette.common.black, 0.6),
                                color: theme.palette.common.white,
                            },
                            '&.Mui-disabled': {
                                background: alpha(theme.palette.common.black, 0.6),
                                color: theme.palette.common.white,
                            },
                        },
                    },
                ],
                styleOverrides: {
                    root: {
                        borderRadius: '10px',
                        textTransform: 'initial',
                        padding: '13px',
                        width: '100%',
                    },
                },
            },
            MuiCssBaseline: {
                styleOverrides: `
                @font-face {
                  font-family: 'Poppins', sans-serif;
                }
              `,
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        width: '100%',
                    },
                },
            },
            MuiPaper: {
                variants: [
                    {
                        props: { variant: 'black-glass' },
                        style: ({ ownerState }) => ({
                            position: 'relative',
                            zIndex: 10,
                            background: 'none',
                            borderRadius: `${ownerState.borderRadius || 12}px`,

                            '&:after': {
                                content: "''",
                                position: 'absolute',
                                inset: 0,
                                borderRadius: `${ownerState.borderRadius || 12}px`,
                                backdropFilter: 'blur(28px)',
                                zIndex: -1,
                                background: alpha(theme.designSystemColors.black.primary, 0.6),
                                overflow: 'hidden',
                            },
                        }),
                    },
                ],
                styleOverrides: {
                    root: {
                        borderRadius: '16px',
                        boxShadow: `0px 12px 24px -4px ${alpha(theme.palette.shadow.primary, 0.1)}`,
                    },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        '&.Mui-focused': {
                            color: theme.palette.text.primary,
                        },
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        '&:hover': {
                            background: alpha(theme.palette.background.default, 0.5),
                        },
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: '10px',
                        background: theme.background.old,
                        '&.Mui-focused': {
                            color: theme.palette.text.primary,
                            '.MuiOutlinedInput-notchedOutline': {
                                borderWidth: '1px',
                                borderColor: theme.borderColor.focused,
                            },
                        },
                    },
                    notchedOutline: {
                        borderWidth: '1px',
                        borderColor: alpha(theme.borderColor.primary, 0.6),
                    },
                },
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        background: theme.palette.common.black,
                        borderRadius: '4px',
                        padding: '2px 7px',
                        height: '22px',
                        fontSize: theme?.typography?.pxToRem?.(12),
                        lineHeight: theme?.typography?.pxToRem?.(18),
                    },
                },
            },
            MuiSwitch: {
                styleOverrides: {
                    root: {
                        borderRadius: '20px',
                        width: '42px',
                        height: '24px',
                        padding: 0,
                    },
                    track: {
                        background: alpha(theme.designSystemColors.grayscale.normal, 0.4),
                        opacity: 1,
                    },
                    switchBase: {
                        top: '2.4px',
                        left: '2.4px',
                        padding: 0,
                        width: '19px',
                        height: '19px',
                        '&.Mui-checked': {
                            color: theme.designSystemColors.white.primary,
                        },
                        '&.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: theme.designSystemColors.orange.primary,
                            opacity: 1,
                        },
                    },
                },
            },
            MuiDivider: {
                variants: [
                    {
                        props: { light: true },
                        style: {
                            backgroundColor: alpha(theme.designSystemColors.grayscale.normal, 0.4),
                        },
                    },
                ],
            },
            MuiChip: {
                variants: [
                    {
                        props: { size: 'medium' },
                        style: {
                            height: '44px',
                            borderRadius: '22px',
                            fontSize: theme.typography.pxToRem(16),
                            lineHeight: theme.typography.pxToRem(24),
                        },
                    },
                ],
                styleOverrides: {
                    root: {
                        cursor: 'pointer',
                        backgroundColor: theme.designSystemColors.white.primary,
                        color: theme.designSystemColors.black.primary,
                        boxShadow: `0px 12px 24px -4px ${theme.palette.shadow.normal}`,

                        '&:hover': {
                            boxShadow: `0px 12px 24px -4px ${theme.palette.shadow.hover}`,
                            backgroundColor: theme.designSystemColors.white.primary,
                            color: theme.designSystemColors.black.primary,
                        },
                    },
                    label: {
                        padding: '10px 22px',
                    },
                },
            },
        },
    });
