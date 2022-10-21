import React from "react";

export type CustomButtonProps = {
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset' | undefined;
    Icon?: React.ReactElement;
    label?: JSX.Element;
};