import React, { memo } from "react";
import { CommonIconProps } from "../types";
import { SvgIconWrapper } from "../SvgIconWrapper";

const PlayIcon = memo(({ width, height, ...rest }: CommonIconProps) => (
  <SvgIconWrapper
    width={width}
    height={height}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...rest}
  >
    <path
      d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z"
      fill="white"
    ></path>
  </SvgIconWrapper>
));

export { PlayIcon };
