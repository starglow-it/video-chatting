import React, { ForwardedRef, ReactElement, RefAttributes } from 'react';

declare module 'react' {
    function forwardRef<T, P = {}>(
        render: (props: P, ref: ForwardedRef<T>) => ReactElement | null,
    ): (props: P & RefAttributes<T>) => ReactElement | null;
}

type LightDarkOption = {
    primary: string;
    light: string;
    dark: string;
};

type GrayScaleOption = {
    light: string;
    dark: string;
    semidark: string;
    normal: string;
    semilight: string;
};

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        body3: true;
        body3bold: true;
        body1bold: true;
        body2bold: true;
        h2bold: true;
        h3bold: true;
        h4bold: true;
        pxToRem: true;
    }
}

declare module '@mui/material/Paper' {
    interface PaperPropsVariantOverrides {
        'black-glass': true;
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        'custom-cancel': true;
        'custom-primary': true;
        'custom-transparent': true;
    }
}

declare module '@mui/material/styles' {
    interface TypographyVariants {
        body3: React.CSSProperties;
        body1bold: React.CSSProperties;
        body2bold: React.CSSProperties;
        body3bold: React.CSSProperties;
        h2bold: React.CSSProperties;
        h3bold: React.CSSProperties;
        h4bold: React.CSSProperties;
        pxToRem: (size: number) => string;
    }

    interface TypographyVariantsOptions {
        body3?: React.CSSProperties;
        body1bold?: React.CSSProperties;
        body2bold?: React.CSSProperties;
        body3bold?: React.CSSProperties;
        h2bold?: React.CSSProperties;
        h3bold?: React.CSSProperties;
        h4bold?: React.CSSProperties;
        pxToRem?: (size: number) => string;
    }

    interface PaperPropsVariantOverrides {
        'black-glass': string;
    }

    interface ButtonPropsVariantOverrides {
        'custom-cancel': string;
        'custom-primary': string;
        'custom-transparent': string;
    }

    interface Theme {
        typography: {
            pxToRem?: (size: number) => string;
            fontWeightSemiBold?: React.CSSProperties['fontWeight'];
        };
        background: {
            default: string;
        };
        borderColor: {
            primary: string;
            focused: string;
        };
        borderRadius: {
            small: string;
            medium: string;
        };
        designSystemColors: {
            black: LightDarkOption;
            white: LightDarkOption;
            orange: LightDarkOption;
            red: LightDarkOption;
            green: LightDarkOption;
            blue: LightDarkOption;
            grayscale: GrayScaleOption;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        typography: {
            pxToRem?: (size: number) => string;
            fontWeightSemiBold?: React.CSSProperties['fontWeight'];
        };
        background?: {
            default: string;
        };
        borderColor?: {
            primary: string;
            focused: string;
        };
        borderRadius?: {
            small: string;
            medium: string;
        };
        designSystemColors: {
            black: LightDarkOption;
            white: LightDarkOption;
            orange: LightDarkOption;
            red: LightDarkOption;
            green: LightDarkOption;
            blue: LightDarkOption;
            grayscale: GrayScaleOption;
        };
    }

    interface Palette {
        buttons: {
            primary: {
                main: string;
                hover: string;
                disabled: string;
            };
            cancel: {
                main: string;
                hover: string;
                disabled: string;
            };
        };
        stroke: {
            primary: string;
            hover: string;
            active: string;
            error: string;
        };
        shadow: {
            primary: string;
            light: string;
            normal: string;
            hover: string;
            contrast: string;
        };
    }

    interface PaletteOptions {
        buttons?: {
            primary: {
                main: string;
                hover: string;
                disabled: string;
            };
            cancel: {
                main: string;
                hover: string;
                disabled: string;
            };
        };
        colors: {
            black: LightDarkOption;
            white: LightDarkOption;
            orange: LightDarkOption;
            red: LightDarkOption;
            green: LightDarkOption;
            blue: LightDarkOption;
            grayscale: GrayScaleOption;
        };
        stroke: {
            primary: string;
            hover: string;
            active: string;
            error: string;
        };
        shadow: {
            primary: string;
            light: string;
            normal: string;
            hover: string;
            contrast: string;
        };
    }
}
