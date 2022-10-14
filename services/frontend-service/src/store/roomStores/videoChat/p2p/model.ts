import { videoChatDomain } from '../../../domains';
import { ErrorState, MeetingUser } from '../../../types';
import {
    ChangeActiveStreamPayload,
    ConnectionsStore,
    CreatePeerConnectionsPayload,
    GetAnswerPayload,
    GetIceCandidatePayload,
    GetOfferPayload,
    IWebRtcConnection,
} from '../types';

// effects
export const createPeerConnectionFx = videoChatDomain.createEffect<
    CreatePeerConnectionsPayload,
    ConnectionsStore,
    ErrorState
>('createPeerConnectionFx');
export const removeConnectionsFx = videoChatDomain.createEffect<
    ConnectionsStore,
    IWebRtcConnection['connectionId'][]
>('removeConnectionsFx');
export const getOfferFx = videoChatDomain.createEffect<GetOfferPayload, void>('getOfferFx');
export const getAnswerFx = videoChatDomain.createEffect<GetAnswerPayload, void>('getAnswerFx');
export const getIceCandidateFx = videoChatDomain.createEffect<GetIceCandidatePayload, void>(
    'getIceCandidateFx',
);
export const startP2PSharingFx = videoChatDomain.createEffect<
    CreatePeerConnectionsPayload,
    ConnectionsStore
>('startP2PSharingFx');
export const stopScreenSharingFx = videoChatDomain.createEffect<
    ConnectionsStore,
    MeetingUser['id'][]
>('stopScreenSharingFx');
export const changeP2PActiveStreamFx = videoChatDomain.createEffect<
    ChangeActiveStreamPayload,
    void
>('changeP2PActiveStreamFx');

// events
export const removePeerConnection = videoChatDomain.createEvent<{ connectionId: string }>(
    'removePeerConnection',
);
export const startP2PSharingEvent = videoChatDomain.createEvent('startP2PSharingEvent');
export const stopP2PSharingEvent = videoChatDomain.createEvent('stopP2PSharingEvent');
export const disconnectFromP2PEvent = videoChatDomain.createEvent('disconnectFromP2PEvent');
export const changeP2PActiveStreamEvent = videoChatDomain.createEvent('changeP2PActiveStreamEvent');
