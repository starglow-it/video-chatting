import React, { ForwardedRef, forwardRef, memo } from "react";

import Button from "@mui/material/Button";
import { ButtonProps } from "@mui/material/Button/Button";

import { CustomTypography } from "../../custom/CustomTypography";
import { CustomLoader } from "../CustomLoader";

import { CustomButtonProps } from "./CustomButton.types";

import styles from "./CustomButton.module.scss";

type ComponentType = ButtonProps & CustomButtonProps;

const Component = (
  {
    disabled,
    Icon,
    type,
    label,
    isLoading,
    variant = "custom-primary",
    children,
    typographyProps,
    onClick,
    ...rest
  }: ComponentType,
  ref: ForwardedRef<HTMLButtonElement>
) => (
  <Button
    disabled={disabled}
    type={type}
    variant={variant}
    ref={ref}
    onClick={isLoading ? () => {} : onClick}
    {...rest}
  >
    {isLoading ? (
      <CustomLoader className={styles.loader} />
    ) : (
      <>
        {Icon}
        {children || (
          <CustomTypography {...typographyProps}>{label}</CustomTypography>
        )}
      </>
    )}
  </Button>
);

const CustomButton = memo<ComponentType>(
  forwardRef<HTMLButtonElement, ComponentType>(Component)
);

export default CustomButton;
