import React, { memo } from "react";

import { CommonIconProps } from "../types";
import { SvgIconWrapper } from "../SvgIconWrapper";

export const ImageIcon = memo(
  ({ width, height, className, onClick }: CommonIconProps) => (
    <SvgIconWrapper
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      viewBox="0 0 16 16"
      fill="none"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke-width="1"
    >
      <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" fill="white" />
      <path
        d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"
        fill="white"
      />
    </SvgIconWrapper>
  )
);
