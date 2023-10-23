import React, { memo } from "react";
import { CommonIconProps } from "../types";
import { SvgIconWrapper } from "../SvgIconWrapper";

const PersonPlusIcon = memo(
  ({ width, height, className, onClick }: CommonIconProps) => (
    <SvgIconWrapper
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path
        fill-rule="evenodd"
        d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
      />
    </SvgIconWrapper>
  )
);

export { PersonPlusIcon };
