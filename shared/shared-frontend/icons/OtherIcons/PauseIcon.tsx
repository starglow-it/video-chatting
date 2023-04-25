import React, { memo } from "react";
import { CommonIconProps } from "../types";
import { SvgIconWrapper } from "../SvgIconWrapper";

const PauseIcon = memo(({ width, height, ...rest }: CommonIconProps) => (
  <SvgIconWrapper
    width={width}
    height={height}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...rest}
  >
    <path
      d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"
      fill="white"
    ></path>
  </SvgIconWrapper>
));

export { PauseIcon };
