import { ILocalAudioTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';

export type MeetingUserAudioItemProps = {
    audioTrack?: IRemoteAudioTrack | ILocalAudioTrack;
    isMicEnabled?: boolean;
    isLocal?: boolean;
};
