import React, { memo } from "react";

import { CommonIconProps } from "../types";

import { SvgIconWrapper } from "../SvgIconWrapper";

const Component = ({ width, height, className, onClick }: CommonIconProps) => (
  <SvgIconWrapper
    width={width}
    height={height}
    className={className}
    onClick={onClick}
    fill="none"
    viewBox="0 0 1024 1024"
    style={{ color: "white" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="white"
      d="M768 832a128 128 0 0 1-128 128H192A128 128 0 0 1 64 832V384a128 128 0 0 1 128-128v64a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64h64z"
    ></path>
    <path
      fill="white"
      d="M384 128a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H384zm0-64h448a128 128 0 0 1 128 128v448a128 128 0 0 1-128 128H384a128 128 0 0 1-128-128V192A128 128 0 0 1 384 64z"
    ></path>
  </SvgIconWrapper>
);

export const CopyIcon = memo(Component);
