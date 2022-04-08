import { MouseEventHandler } from "react";

export type ProfileAvatarProps = {
    src?: string | undefined;
    width: string;
    height: string;
    userName: string;
    className?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
    withoutShadow?: boolean;
};
