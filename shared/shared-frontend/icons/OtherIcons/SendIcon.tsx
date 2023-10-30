import React, { memo } from "react";

import { CommonIconProps } from "../types";

import { SvgIconWrapper } from "../SvgIconWrapper";

const Component = memo(
  ({ width, height, className, ...rest }: CommonIconProps) => (
    <SvgIconWrapper
      width={width}
      height={height}
      className={className}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>ionicons-v5-q</title>
      <path d="M16,464,496,256,16,48V208l320,48L16,304Z" />
    </SvgIconWrapper>
  )
);

export const SendIcon = memo(Component);
