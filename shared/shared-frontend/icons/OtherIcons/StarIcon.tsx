import React, { ForwardedRef, forwardRef, memo } from "react";

import { SvgIconWrapper } from "../SvgIconWrapper";
import { CommonIconProps } from "../types";

const Component = (
  {
    width,
    height,
    className,
    onClick,
    ...rest
  }: CommonIconProps & { isHalfVolume?: boolean },
  ref: ForwardedRef<SVGSVGElement>
) => (
  <SvgIconWrapper
    ref={ref}
    width={width}
    height={height}
    className={className}
    onClick={onClick}
    viewBox="0 0 25 24"
    fill="none"
    {...rest}
  >
    <path
      d="M11.9985 5.04561C12.381 4.36696 13.3583 4.36696 13.7408 5.0456L15.3428 7.88793C15.4855 8.14111 15.7313 8.31968 16.0162 8.37716L19.2145 9.02248C19.9781 9.17656 20.2801 10.106 19.7529 10.6795L17.5447 13.0815C17.348 13.2954 17.2541 13.5844 17.2875 13.8731L17.6621 17.1142C17.7515 17.8881 16.9609 18.4625 16.2525 18.1383L13.2858 16.7805C13.0215 16.6596 12.7177 16.6596 12.4535 16.7805L9.48668 18.1383C8.77832 18.4625 7.98769 17.8881 8.07713 17.1142L8.45172 13.8731C8.48508 13.5844 8.3912 13.2954 8.19451 13.0815L5.98636 10.6795C5.45913 10.106 5.76113 9.17656 6.52476 9.02248L9.72304 8.37716C10.0079 8.31968 10.2537 8.14111 10.3964 7.88793L11.9985 5.04561Z"
      fill="currentColor"
    />
  </SvgIconWrapper>
);

export const StarIcon = memo(forwardRef(Component));
