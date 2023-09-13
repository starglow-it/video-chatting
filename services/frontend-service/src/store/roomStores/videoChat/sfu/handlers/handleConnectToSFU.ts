import {
    LocalParticipant,
    LocalTrackPublication,
    RemoteParticipant,
    RemoteTrack,
    RemoteTrackPublication,
    Room,
    RoomEvent,
    Track,
    VideoPresets,
} from 'livekit-client';

import { removeConnectionStream, setConnectionStream } from '../../model';
import { getLiveKitTokenFx } from '../model';
import { ConnectToSFUPayload } from '../../types';
import { MeetingUser } from '../../../../types';
import {
    ConnectionType,
    StreamType,
    TrackKind,
} from '../../../../../const/webrtc';

import { updateMeetingSocketEvent } from '../../../meeting/sockets/model';
import frontendConfig from '../../../../../const/config';
import { getMeetingInstanceLivekitUrl } from '../../../../../utils/functions/getMeetingInstanceLivekitUrl';
import { getConnectionKey } from '../../../../../helpers/media/getConnectionKey';

const getConnectionIdHelper = ({
    source,
    userId,
}: {
    source: Track.Source;
    userId: MeetingUser['id'];
}) =>
    getConnectionKey({
        userId,
        streamType:
            source === Track.Source.ScreenShare
                ? StreamType.SCREEN_SHARING
                : StreamType.VIDEO_CHAT,
        connectionType: ConnectionType.VIEW,
    });

const setStreamDataHelper = ({
    userId,
    type,
    source,
    trackPub,
}: {
    userId: MeetingUser['id'];
    type: TrackKind;
    source: Track.Source;
    trackPub?: LocalTrackPublication | RemoteTrackPublication;
}) => ({
    type,
    track:
        trackPub?.kind === 'audio'
            ? trackPub?.audioTrack?.mediaStreamTrack
            : trackPub?.videoTrack?.mediaStreamTrack,
    connectionId: getConnectionIdHelper({ userId, source }),
});

const handleLocalTrackPublished = (
    localTrackPublication: LocalTrackPublication,
    localParticipant: LocalParticipant,
) => {
    setConnectionStream(
        setStreamDataHelper({
            type: localTrackPublication.kind as unknown as TrackKind,
            source: localTrackPublication.source,
            userId: localParticipant.identity,
            trackPub: localTrackPublication,
        }),
    );
};

const handleLocalTrackUnpublished = (localTrackPub: LocalTrackPublication) => {
    if (localTrackPub.source === Track.Source.ScreenShare) {
        updateMeetingSocketEvent({ sharingUserId: null });
    }
};

const handleRemoteTrackPublished = (
    remoteTrackPub: RemoteTrackPublication,
    remoteParticipant: RemoteParticipant,
) => {
    setConnectionStream(
        setStreamDataHelper({
            type: remoteTrackPub.kind as unknown as TrackKind,
            source: remoteTrackPub.source,
            userId: remoteParticipant.identity,
            trackPub: remoteTrackPub,
        }),
    );
};

const handleRemoteTrackUnpublished = (
    remoteTrackPub: RemoteTrackPublication,
    remoteParticipant: RemoteParticipant,
) => {
    removeConnectionStream({
        connectionId: getConnectionIdHelper({
            userId: remoteParticipant.identity,
            source: remoteTrackPub.source,
        }),
    });
};

const handleTrackSubscribed = (
    remoteTrack: RemoteTrack,
    remotePublication: RemoteTrackPublication,
    remoteParticipant: RemoteParticipant,
) => {
    setConnectionStream(
        setStreamDataHelper({
            type: remoteTrack.kind as unknown as TrackKind,
            source: remoteTrack.source,
            userId: remoteParticipant.identity,
            trackPub: remotePublication,
        }),
    );
};

const handleTrackUnsubscribed = (
    remoteTrack: RemoteTrack,
    remotePublication: RemoteTrackPublication,
    remoteParticipant: RemoteParticipant,
) => {
    removeConnectionStream({
        connectionId: getConnectionIdHelper({
            userId: remoteParticipant.identity,
            source: remotePublication.source,
        }),
    });
};

const handleParticipantConnected = (participant: RemoteParticipant) => {
    console.log(RoomEvent.ParticipantConnected, participant);
};

export const handleConnectToSFU = async ({
    templateId,
    userId,
    serverIp,
}: ConnectToSFUPayload) => {
    const token = await getLiveKitTokenFx({
        templateId,
        userId,
    });

    const room = new Room({
        dynacast: true,
        videoCaptureDefaults: {
            resolution: VideoPresets.h360.resolution,
        },
        stopLocalTrackOnUnpublish: true,
        publishDefaults: {
            videoCodec: 'vp8',
        },
    });

    room.on(RoomEvent.LocalTrackPublished, handleLocalTrackPublished)
        .on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished)
        .on(RoomEvent.ParticipantConnected, handleParticipantConnected)
        .on(RoomEvent.TrackPublished, handleRemoteTrackPublished)
        .on(RoomEvent.TrackUnpublished, handleRemoteTrackUnpublished)
        .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
        .on(RoomEvent.ConnectionStateChanged, (...args) => {
            console.log(
                'RoomEvent.ConnectionStateChanged',
                RoomEvent.ConnectionStateChanged,
            );
            console.log(args);
        })
        .on(RoomEvent.Disconnected, (...args) => {
            console.log('RoomEvent.Disconnected', RoomEvent.Disconnected);
            console.log(args);
        })
        .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
        .on(RoomEvent.Reconnecting, () => console.log(RoomEvent.Reconnecting))
        .on(RoomEvent.Reconnected, (...arg) => {
            console.log(RoomEvent.Reconnected)
            console.log('#Duy Phan console', arg)
        });

    const livekitWssUrl = [
        'localhost',
        frontendConfig.defaultServerIp,
    ].includes(serverIp)
        ? frontendConfig.livekitWss
        : getMeetingInstanceLivekitUrl(serverIp);

    await room.connect(livekitWssUrl, token);

    return room;
};
