import {memo} from "react";

import {CommonIconProps} from "@library/types";

import {SvgIconWrapper} from "@library/icons/SvgIconWrapper";

const Component = ({ width, height, className, onClick }: CommonIconProps) => {
    return (
        <SvgIconWrapper className={className} onClick={onClick} width={width} height={height} viewBox="0 0 22 22" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M7.35601 7.11061V6.0499C7.35601 4.87826 8.3058 3.92847 9.47743 3.92847H12.306C13.4776 3.92847 14.4274 4.87826 14.4274 6.0499V7.11061H15.733C16.9664 7.11061 17.9397 8.15875 17.8486 9.38875L17.351 16.1066C17.2689 17.2144 16.3462 18.0713 15.2354 18.0713H6.54788C5.43704 18.0713 4.5143 17.2144 4.43224 16.1066L3.93462 9.38875C3.84351 8.15875 4.81689 7.11061 6.05026 7.11061H7.35601ZM8.77029 6.0499C8.77029 5.65935 9.08689 5.34275 9.47743 5.34275H12.306C12.6965 5.34275 13.0131 5.65935 13.0131 6.0499V7.11061H8.77029V6.0499ZM8.06315 13.8285C7.6726 13.8285 7.35601 14.1451 7.35601 14.5356C7.35601 14.9262 7.6726 15.2428 8.06315 15.2428H13.7203C14.1108 15.2428 14.4274 14.9262 14.4274 14.5356C14.4274 14.1451 14.1108 13.8285 13.7203 13.8285H8.06315Z" fill="currentColor" />
        </SvgIconWrapper>
    )
}

export const GoodsIcon = memo(Component)