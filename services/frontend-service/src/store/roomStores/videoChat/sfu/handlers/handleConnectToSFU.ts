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

import { EgressClient } from 'livekit-server-sdk';

import {
    disconnectFromVideoChatEvent,
    removeConnectionStream,
    setConnectionStream,
} from '../../model';
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
import {
    $transcriptionQueue,
    setTranscriptionParticipant,
    setTranscriptionParticipantGuest,
    setTranscriptionQueue,
    setTranscriptionResult,
    setTranscriptionResultGuest,
} from '../../../transcription/model';
import { awsTranscribeServiceUrl } from 'src/const/urls/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mic = require('microphone-stream').default;
  
let myRoomName = '';
let userName = '';
let socket: WebSocket;

let i = 1;

let lastMessageTime = Date.now();

function streamAudioToWebSocket(userMediaStream: MediaStream) {
    // eslint-disable-next-line new-cap
    const micStream = new mic();
    micStream.setStream(userMediaStream);

    socket.binaryType = 'arraybuffer';

    micStream.on(
        'data',
        (rawAudioChunk: string | ArrayBufferLike | Blob | ArrayBufferView) => {
            if (socket.readyState === socket.OPEN) {
                socket.send(rawAudioChunk);
                i++;
            } else {
                // console.log(`Else condition- ${socket.readyState}`);
            }
        },
    );
}

function deduplicateText(input: any) {
    const tokens = input.split(" ");
    const seen = new Set();
    let result: any = [];

    tokens.forEach((token: any) => {
        let phrase = token.toLowerCase();
        if (!seen.has(phrase)) {
            seen.add(phrase);
            result.push(token);
        }
    });

    return result.join(" ");
}

function pushOrReplaceWithPartialMatch(queue: any, sender: any, rawMessage: any) {
    const now = Date.now();
    const timeSinceLastMessage = now - lastMessageTime;
    lastMessageTime = now;
    const isBreak = timeSinceLastMessage > 2000;

    const cleanedMessage = deduplicateText(rawMessage);
    if (isBreak || queue.length === 0 || queue[queue.length - 1].sender !== sender) {
        queue.push({ sender, message: cleanedMessage });
    } else {
        let lastEntry = queue[queue.length - 1];
        lastEntry.message += " " + cleanedMessage;
    }
    return queue;
}

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

const handleLocalTrackPublished = async (
    localTrackPublication: LocalTrackPublication,
    localParticipant: LocalParticipant,
) => {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('getUserMedia is not supported in this browser');
        }
        console.log(
            'Publish Local Track',
            localTrackPublication.trackSid,
            RoomEvent.Connected,
        );

        if (localTrackPublication.kind === 'audio') {
            window.navigator.mediaDevices
                .getUserMedia({
                    video: false,
                    audio: true,
                })
                .then(streamAudioToWebSocket)
                .catch(error => {
                    console.error(
                        error,
                        'There was an error streaming your audio to Amazon Transcribe. Please try again.',
                    );
                });

            const info = await new EgressClient(
                frontendConfig.livekitHost,
                frontendConfig.livekitApi,
                frontendConfig.livekitSecret,
            ).startTrackEgress(
                myRoomName.toString(),
                `${frontendConfig.egressWss.toString()}/${awsTranscribeServiceUrl}?roomId=${myRoomName}&participantName=${userName}`,
                localTrackPublication.trackSid.toString(),
            );
            console.log('🚀 ~ file: handleConnectToSFU.ts:81 ~ info:', info);
        }

        setConnectionStream(
            setStreamDataHelper({
                type: localTrackPublication.kind as unknown as TrackKind,
                source: localTrackPublication.source,
                userId: localParticipant.identity,
                trackPub: localTrackPublication,
            }),
        );
    } catch (error) {
        console.log(error);
    }
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
    console.log('Unpublised track');
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
    console.log('Unpublised track');
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
    console.log('Unsubscribed track');
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
    participantName
}: ConnectToSFUPayload) => {
    try {
        const token = await getLiveKitTokenFx({
            templateId,
            userId,
        });
        serverIp = frontendConfig.defaultServerIp;
        const room = new Room({
            dynacast: true,
            videoCaptureDefaults: {
                resolution: VideoPresets.h360.resolution,
            },
            stopLocalTrackOnUnpublish: false,
            publishDefaults: {
                videoCodec: 'vp8',
            },
        });

        room.on(RoomEvent.LocalTrackPublished, handleLocalTrackPublished)
            .on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished)
            .on(RoomEvent.ParticipantConnected, handleParticipantConnected)
            .on(RoomEvent.ParticipantDisconnected, (...data) => {
                console.log(RoomEvent.ParticipantDisconnected, data);
            })
            .on(RoomEvent.TrackPublished, handleRemoteTrackPublished)
            .on(RoomEvent.TrackUnpublished, handleRemoteTrackUnpublished)
            .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
            .on(RoomEvent.ConnectionStateChanged, (...args) => {
                console.log(RoomEvent.ConnectionStateChanged, args);
            })
            .on(RoomEvent.Disconnected, () => {
                console.log(RoomEvent.Disconnected);
                disconnectFromVideoChatEvent();
            })
            .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
            .on(RoomEvent.Reconnecting, () => console.log(RoomEvent.Reconnecting))
            .on(RoomEvent.Reconnected, () => {
                console.log(RoomEvent.Reconnected);
            });

        const livekitWssUrl = [
            'localhost',
            frontendConfig.defaultServerIp,
        ].includes(serverIp)
            ? frontendConfig.livekitWss
            : getMeetingInstanceLivekitUrl(serverIp);

        await room.connect(livekitWssUrl, token);

        myRoomName = room.name;
        userName = participantName;
        socket = new WebSocket(
            `${frontendConfig.egressWss.toString()}/${awsTranscribeServiceUrl}?roomId=${myRoomName}&participantName=${participantName}`,
        );

        console.log('Socket created');
        const participantNameInQueue: string[] = [];
        // const transcriptionQueue: string[] = [];
        // socket.onmessage = function (event) {
        //     pushOrReplaceWithPartialMatch(transcriptionQueue, event.data);

        //     setTranscriptionQueue(transcriptionQueue);
        // const transcriptionQueue: string[] = [];

        // const transcriptionQueue = [{
        //     sender: "65c3c30c4e06ea38ddf68572",
        //     message: "Initial message"
        // }];

        socket.onmessage = function (event) {

            const [sender, rawMessage] = event.data.split('@', 2); // Splitting sender and message
            const updatedQueue = pushOrReplaceWithPartialMatch($transcriptionQueue.getState(), sender, rawMessage);
            setTranscriptionQueue(updatedQueue);

            if (participantNameInQueue.length === 0) {
                setTranscriptionResult(event.data.split('@')[1]);
                setTranscriptionParticipant(event.data.split('@')[0]);
            }

            if (!participantNameInQueue.includes(event.data.split('@')[0])) {
                participantNameInQueue.push(
                    setTranscriptionParticipant(event.data.split('@')[0]),
                );
            }

            if (participantNameInQueue.indexOf(event.data.split('@')[0]) === 0) {
                setTranscriptionResult(event.data.split('@')[1]);
                setTranscriptionParticipant(event.data.split('@')[0]);
            } else {
                setTranscriptionResultGuest(event.data.split('@')[1]);
                setTranscriptionParticipantGuest(event.data.split('@')[0]);
            }
        };

        socket.onclose = function (event) {
            if (event.wasClean) {
                console.log(
                    `Connection closed cleanly, code=${event.code}, reason=${event.reason}`,
                );
            } else {
                console.error('Connection abruptly closed');
            }
        };
        return room;
    } catch (error) {
        console.log('Error handling ConnectToSFU: ', error)
    }
};
;