import React, { ForwardedRef, forwardRef, memo } from "react";
import { CommonIconProps } from "../types";
import { SvgIconWrapper } from "../SvgIconWrapper";

const Component = (
  { width, height, className, onClick, ...rest }: CommonIconProps,
  ref: ForwardedRef<SVGSVGElement>
) => (
  <SvgIconWrapper
    ref={ref}
    onClick={onClick}
    width={width}
    height={height}
    className={className}
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z" />
  </SvgIconWrapper>
);

export const AsterriskIcon = memo(forwardRef(Component));
