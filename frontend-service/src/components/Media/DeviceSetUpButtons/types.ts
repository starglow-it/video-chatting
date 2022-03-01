import { PropsWithClassName } from '../../../types';

export type AudioDeviceSetUpButtonProps = PropsWithClassName<{
    isMicActive?: boolean;
    onClick?: () => void;
}>;

export type VideoDeviceSetUpButtonProps = PropsWithClassName<{
    isCamActive?: boolean;
    onClick?: () => void;
}>;
