import { ILocalVideoTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng';

export type ScreenSharingVideoProps = {
    videoTrack?: IRemoteVideoTrack | ILocalVideoTrack;
};
