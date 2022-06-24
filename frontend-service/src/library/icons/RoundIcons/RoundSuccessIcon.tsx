import {memo} from "react";

import {CommonIconProps} from "@library/types";

const Component = ({ width, height, className, onClick, ...rest }: CommonIconProps) => {
    return (
        <svg width={width} height={height} viewBox="0 0 16 16" fill="none" {...rest}>
            <circle cx="8" cy="8" r="8" fill="#69E071"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M7.33684 8.83653L10.8348 5.33859C11.1107 5.06271 11.5579 5.06271 11.8338 5.33858C12.1097 5.61446 12.1097 6.06174 11.8338 6.33762L7.3372 10.8342L4.4996 7.99725C4.22369 7.7214 4.22366 7.2741 4.49954 6.99822C4.7754 6.72236 5.22266 6.72236 5.49852 6.99822L7.33684 8.83653Z" fill="white"/>
        </svg>
    )
}

export const RoundSuccessIcon = memo(Component);