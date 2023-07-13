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
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path d="M10 16v-1H3.01L3 19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-4h-7v1h-4zm10-9h-4.01V5l-2-2h-4l-2 2v2H4c-1.1 0-2 .9-2 2v3c0 1.11.89 2 2 2h6v-2h4v2h6c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6 0h-4V5h4v2z" />
  </SvgIconWrapper>
);

export const BusinessIcon = memo(forwardRef(Component));
