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
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke-width="1"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M20.4 14.5L16 10 4 20" />
    </SvgIconWrapper>
  )
);
