import React, { memo } from "react";

import { CommonIconProps } from "../types";

import { SvgIconWrapper } from "../SvgIconWrapper";

const Component = memo(
  ({ width, height, className, ...rest }: CommonIconProps) => (
    <SvgIconWrapper
      width={width}
      height={height}
      className={className}
      viewBox="0 0 45 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>ionicons-v5-q</title>
      <path d="M43.4351 17.6469C45.0987 18.3222 45.0987 20.6778 43.4351 21.3531L2.75228 37.8683C1.4372 38.4021 0 37.4345 0 36.0152V2.98484C0 1.56553 1.4372 0.597859 2.75228 1.13171L43.4351 17.6469Z" fill="#5B5A5A" />
    </SvgIconWrapper>
  )
);

export const SendIcon = memo(Component);
